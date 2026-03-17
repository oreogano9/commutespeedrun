const API_BASE = 'https://prod.api.market/api/v1/aedbx/aerodatabox';
const AIRPORT_ICAO = 'LIRF';
const TIME_ZONE = 'Europe/Rome';

const statusMap = {
  Expected: 'Scheduled',
  EnRoute: 'On Time',
  CheckIn: 'Scheduled',
  Boarding: 'Boarding',
  GateClosed: 'Gate Closed',
  Departed: 'On Time',
  Approaching: 'Taxiing',
  Arrived: 'Landed',
  Canceled: 'Cancelled',
  Diverted: 'Delayed',
  Unknown: 'Scheduled',
};

const formatTime = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(date);
};

const computeDelay = (scheduled, revised) => {
  if (!scheduled || !revised) return 0;
  const s = new Date(scheduled).getTime();
  const r = new Date(revised).getTime();
  if (Number.isNaN(s) || Number.isNaN(r)) return 0;
  return Math.max(0, Math.round((r - s) / 60000));
};

const formatAirport = (airport) => {
  if (!airport) return 'Unknown';
  const code = airport.iata || airport.icao || '';
  const name = airport.name || 'Unknown';
  return code ? `${name} (${code})` : name;
};

const selectTime = (movement) => {
  return (
    movement?.revisedTime ||
    movement?.predictedTime ||
    movement?.actualTime ||
    movement?.scheduledTime ||
    null
  );
};

const mapFlight = (flight, type) => {
  const movement = type === 'arrivals' ? flight.arrival ?? flight.movement : flight.departure ?? flight.movement;
  const otherSide = type === 'arrivals' ? flight.departure : flight.arrival;
  const rawTime = selectTime(movement);
  const scheduled = movement?.scheduledTime || null;
  const delayMinutes = computeDelay(scheduled, rawTime);
  const statusRaw = flight.status || 'Unknown';

  return {
    id: `${flight.number || flight.callSign || flight.id || 'flight'}-${rawTime || scheduled || Math.random()}`,
    type,
    flightCode: flight.number || flight.callSign || flight.id || 'Unknown',
    airline: flight.airline?.name || flight.airline?.iata || flight.airline?.icao || 'Unknown',
    route: formatAirport(otherSide?.airport || otherSide || movement?.airport),
    time: formatTime(rawTime) || formatTime(scheduled) || '--:--',
    terminal: movement?.terminal || 'TBD',
    gate: movement?.gate || undefined,
    belt: movement?.baggageBelt ? String(movement.baggageBelt) : undefined,
    status: statusMap[statusRaw] || 'Scheduled',
    delayMinutes,
    updatedAt: formatTime(rawTime) || formatTime(scheduled) || formatTime(new Date().toISOString()),
  };
};

exports.handler = async (event) => {
  const apiKey = process.env.AERODATABOX_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing AERODATABOX_API_KEY' }),
      headers: { 'content-type': 'application/json' },
    };
  }

  const type = (event.queryStringParameters?.type || 'arrivals').toLowerCase();
  const direction = type === 'departures' ? 'Departure' : 'Arrival';
  const offset = Number(event.queryStringParameters?.offset || 0);
  const limit = Number(event.queryStringParameters?.limit || 6);
  const offsetMinutes = event.queryStringParameters?.offsetMinutes || '-120';
  const durationMinutes = event.queryStringParameters?.durationMinutes || '720';

  const url = new URL(`${API_BASE}/flights/airports/icao/${AIRPORT_ICAO}`);
  url.searchParams.set('direction', direction);
  url.searchParams.set('withLeg', 'true');
  url.searchParams.set('offsetMinutes', offsetMinutes);
  url.searchParams.set('durationMinutes', durationMinutes);

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      'x-magicapi-key': apiKey,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      statusCode: response.status,
      body: JSON.stringify({ error: 'Upstream API error', detail: text.slice(0, 300) }),
      headers: { 'content-type': 'application/json' },
    };
  }

  const payload = await response.json();
  const list = direction === 'Arrival' ? payload.arrivals || [] : payload.departures || [];
  const mapped = list
    .map((flight) => mapFlight(flight, type === 'departures' ? 'departures' : 'arrivals'))
    .sort((a, b) => a.time.localeCompare(b.time));

  const sliced = Number.isFinite(offset) ? mapped.slice(offset, offset + limit) : mapped;

  return {
    statusCode: 200,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
    body: JSON.stringify(sliced),
  };
};

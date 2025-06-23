const { DynamoDBClient, PutItemCommand, ScanCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

const db = new DynamoDBClient({ region: "ap-south-1" });
const tableName = process.env.LOCATIONS_TABLE;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

module.exports.storeLocation = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  const body = JSON.parse(event.body);
  const id = uuidv4();

  const item = {
    id: { S: id },
    locationName: { S: body.locationName },
    city: { S: body.city },
    country: { S: body.country },
    image: { S: body.image },
    climate: { S: body.climate },
    cost: { S: body.cost },
    description: { S: body.description },
    bestTimeToVisit: { S: body.bestTimeToVisit },
    thingsToDo: { SS: body.thingsToDo },
    selectedVibes: { SS: body.selectedVibes }
  };

  await db.send(new PutItemCommand({ TableName: tableName, Item: item }));

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({ message: "Location saved", id }),
  };
};

module.exports.getLocations = async () => {
  const result = await db.send(new ScanCommand({ TableName: tableName }));

  const locations = result.Items.map((item) => ({
    id: item.id.S,
    locationName: item.locationName.S,
    city: item.city.S,
    country: item.country.S,
    image: item.image.S,
    climate: item.climate.S,
    cost: item.cost.S,
    description: item.description.S,
    bestTimeToVisit: item.bestTimeToVisit.S,
    thingsToDo: item.thingsToDo?.SS || [],
    selectedVibes: item.selectedVibes?.SS || []
  }));

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify(locations),
  };
};

module.exports.getLocationById = async (event) => {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders, body: "" };
    }
  
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Missing location ID" }),
      };
    }
  
    try {
      const result = await db.send(
        new GetItemCommand({
          TableName: tableName,
          Key: {
            id: { S: id },
          },
        })
      );
  
      if (!result.Item) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Location not found" }),
        };
      }
  
      const item = result.Item;
      const location = {
        id: item.id.S,
        locationName: item.locationName.S,
        city: item.city.S,
        country: item.country.S,
        image: item.image.S,
        climate: item.climate.S,
        cost: item.cost.S,
        description: item.description.S,
        bestTimeToVisit: item.bestTimeToVisit.S,
        thingsToDo: item.thingsToDo?.SS || [],
        selectedVibes: item.selectedVibes?.SS || [],
      };
  
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(location),
      };
    } catch (error) {
      console.error("Error fetching location:", error);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Internal server error" }),
      };
    }
  };
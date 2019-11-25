import { getSharedAccessToken } from "./handler";

it("generates shared access token", () => {
  const token = getSharedAccessToken(
    "https://mybus.servicebus.windows.net/myqueue",
    "name",
    "abc"
  );
  expect(token).toBeDefined();
});

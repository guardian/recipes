import { getProxyPath } from "~utils/proxy";

test("getProxyPath without a leading slash", () => {
  const input = "foo/bar";
  expect(getProxyPath(input)).toBe("/proxy/foo/bar#noads");
});

test("getProxyPath with a leading slash", () => {
  const input = "/foo/bar";
  expect(getProxyPath(input)).toBe("/proxy/foo/bar#noads");
});

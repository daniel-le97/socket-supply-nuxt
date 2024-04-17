export default defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/plain");
   return "hello world!";
 });
 
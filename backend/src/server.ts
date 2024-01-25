export const server = require("./app")();

async function main() {
  try {
    // host is specified to run in docker container
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log(`Server listening at port ${3000}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

export const server = require("./app")();

async function main() {
  try {
    // host is specified to run in docker container
    await server.listen({ port: Number(process.env.PORT), host: "0.0.0.0" });
    console.log(`Server listening at port ${process.env.PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();

#!/usr/bin/env node

import chalk from "chalk";
import program from "commander";
import got, { RequestError } from "got";
import cheerio from "cheerio";
import ora from "ora";

const display = (cmdObj: any, args: string[]) => {
  let cmd = args[0];
  cmd = cmd.trim();
  const spinner = ora(chalk.green(`fetching ${cmd}`)).start();

  (async () => {
    try {
      const { body } = await got.get<any>(
        `https://command-not-found.com/${cmd}`,
        {
          hooks: {
            beforeRedirect: [
              (options, response) => {
                let url = options.url;
                if (
                  url.hostname === "command-not-found.com" &&
                  url.pathname === "/"
                ) {
                  throw new RequestError("abort", { code: "-100" }, options);
                }
              },
            ],
          },
        }
      );
      const $ = cheerio.load(body);
      spinner.succeed("fetching succeed.");

      let commandName = $(".row-command-info > div > h2").text();
      let commandDescription = $(".row-command-info > div > p").text();
      let installList = $(
        "div.col-install > div.card.card-install > div.card-body > dl > div"
      );

      console.log(chalk.blue("name: ") + commandName.trim());
      console.log(chalk.blue("description: ") + commandDescription.trim());
      installList
        .toArray()
        .slice(1)
        .map((item) => {
          console.log(
            chalk.greenBright("- OS: ") +
              $(item).find("dt").contents().last().text().trim()
          );
          console.log(
            chalk.greenBright("  Command: ") + $(item).find("dd").text().trim()
          );
        });
    } catch (error) {
      if (error.code === "-100") {
        spinner.fail(chalk.red(`cannot find ${cmd}.`));
      } else {
        spinner.fail(chalk.red("fetch failed."));
        console.log(error);
      }
    } finally {
      spinner.stop();
    }
  })();
};

program
  .version("0.0.1")
  .description("a cli tool to find the right package.")
  .command("<cmd>", "command name")
  .action(display);
// 必须在.parse()之前
program.on("--help", () => {
  console.log("");
  console.log("Example call:");
  console.log("  $ cnf nc");
});
program.parse(process.argv);

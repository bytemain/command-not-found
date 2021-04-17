#!/usr/bin/env node

import chalk from 'chalk';
import got, { RequestError } from 'got';
import cheerio from 'cheerio';
import ora from 'ora';

const display = async (cmd: string) => {
  const spinner = ora(chalk.green(`fetching ${cmd}`)).start();

  try {
    const { body } = await got.get<any>(
      `https://command-not-found.com/${cmd}`,
      {
        hooks: {
          beforeRedirect: [
            (options, response) => {
              let url = options.url;
              if (
                url.hostname === 'command-not-found.com' &&
                url.pathname === '/'
              ) {
                // 被重定向了，说明查的这个命令不存在。
                throw new RequestError('abort', { code: '-100' }, options);
              }
            },
          ],
        },
      }
    );
    const $ = cheerio.load(body);
    spinner.succeed('fetching succeed.');

    let commandName = $('.row-command-info > div > h2').text();
    let commandDescription = $('.row-command-info > div > p').text();
    let installList = $(
      'div.col-install > div.card.card-install > div.card-body > dl > div'
    );

    console.log(chalk.blue('name: ') + commandName.trim());
    console.log(chalk.blue('description: ') + commandDescription.trim());
    installList
      .toArray()
      .slice(1)
      .map((item) => {
        const os = $(item).find('dt').contents().last().text().trim();

        console.log(chalk.greenBright('- OS: ') + os);
        console.log(
          chalk.greenBright('  Command: ') +
            $(item).find('dd > code').text().trim()
        );
      });
  } catch (error) {
    if (error.code === '-100') {
      spinner.fail(chalk.red(`cannot find ${cmd}.`));
    } else {
      spinner.fail(chalk.red('fetch failed.'));
      console.log(error);
    }
  } finally {
    spinner.stop();
  }
};

function main() {
  if (process.argv.length < 3) {
    console.log('Please input the missing command');
    console.log('Example: ');
    console.log('    - cnf dig');
    console.log('    - cnf whois');
    process.exit(1);
  }

  const cmd = process.argv[2];
  display(cmd);
}

main();

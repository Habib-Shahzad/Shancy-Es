type SpinnerOperationProps = {
  loadingText: string;
  successText: string;
  operation: () => Promise<void>;
  errorText?: string;
};

export async function spinnerOperation({
  loadingText,
  successText,
  errorText,
  operation,
}: SpinnerOperationProps) {
  const chalk = (await import("chalk")).default;
  const ora = (await import("ora")).default;
  const spinner = ora(chalk.cyanBright(loadingText)).start();
  try {
    await operation();
    spinner.succeed(chalk.green(`${successText}..\n`));
  } catch (e: any) {
    spinner.fail(chalk.red(`${errorText} ${e?.message}..\n`));
  }
}

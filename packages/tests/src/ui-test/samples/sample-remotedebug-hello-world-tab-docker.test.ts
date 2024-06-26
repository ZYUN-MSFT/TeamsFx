// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @author Ivan Chen <v-ivanchen@microsoft.com>
 */

import { Page } from "playwright";
import { TemplateProject } from "../../utils/constants";
import { validateTab } from "../../utils/playwrightOperation";
import { CaseFactory } from "./sampleCaseFactory";
import { Env } from "../../utils/env";

class HelloWorldTabDockerTestCase extends CaseFactory {
  override async onValidate(
    page: Page,
    options?: { includeFunction: boolean }
  ): Promise<void> {
    return await validateTab(page, {
      displayName: Env.displayName,
      includeFunction: options?.includeFunction,
    });
  }
}

new HelloWorldTabDockerTestCase(
  TemplateProject.HelloWorldTabDocker,
  27852473,
  "v-ivanchen@microsoft.com",
  "dev",
  undefined,
  { container: true }
).test();

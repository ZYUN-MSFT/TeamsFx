// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/****************************************************************************************
 *                            NOTICE: AUTO-GENERATED                                    *
 ****************************************************************************************
 * This file is automatically generated by script "./src/question/generator.ts".        *
 * Please don't manually change its contents, as any modifications will be overwritten! *
 ***************************************************************************************/

import { CLICommandOption, CLICommandArgument } from "@microsoft/teamsfx-api";

export const ValidateTeamsAppOptions: CLICommandOption[] = [
  {
    name: "teams-manifest-file",
    questionName: "manifest-path",
    type: "string",
    shortName: "t",
    description:
      "Specify the path for Teams app manifest template. It can be either absolute path or relative path to the project root folder, with default at './appPackage/manifest.json'",
    default: "./appPackage/manifest.json",
  },
  {
    name: "app-package-file",
    questionName: "app-package-file-path",
    type: "string",
    shortName: "p",
    description:
      "Specifies the zipped Microsoft Teams app package path, it's a relative path to project root folder, defaults to '${folder}/appPackage/build/appPackage.${env}.zip'",
  },
];
export const ValidateTeamsAppArguments: CLICommandArgument[] = [];

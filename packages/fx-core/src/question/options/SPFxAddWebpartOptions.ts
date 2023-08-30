// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/****************************************************************************************
 *                            NOTICE: AUTO-GENERATED                                    *
 ****************************************************************************************
 * This file is automatically generated by script "./src/question/generator.ts".        *
 * Please don't manually change its contents, as any modifications will be overwritten! *
 ***************************************************************************************/

import { CLICommandOption, CLICommandArgument } from "@microsoft/teamsfx-api";

export const SPFxAddWebpartOptions: CLICommandOption[] = [
  {
    name: "spfx-folder",
    type: "string",
    description: "Directory or Path that contains the existing SharePoint Framework solution.",
    required: true,
  },
  {
    name: "spfx-webpart-name",
    type: "string",
    shortName: "w",
    description: "Name for SharePoint Framework Web Part.",
    required: true,
    default: "helloworld",
  },
  {
    name: "teams-manifest-file",
    questionName: "manifest-path",
    type: "string",
    shortName: "t",
    description:
      "Specifies the Teams app manifest template file path, it's a relative path to project root folder, defaults to './appPackage/manifest.json'",
    required: true,
  },
  {
    name: "local-manifest-path",
    type: "string",
    description: "Select local Teams manifest.json file",
    required: true,
  },
];
export const SPFxAddWebpartArguments: CLICommandArgument[] = [];

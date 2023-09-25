// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { ConstantString } from "./constants";
import { AdaptiveCard, WrappedAdaptiveCard } from "./interfaces";

export function wrapAdaptiveCard(
  card: AdaptiveCard,
  jsonPath: string,
  title: string,
  subtitle: string
): WrappedAdaptiveCard {
  const result: WrappedAdaptiveCard = {
    version: ConstantString.WrappedCardVersion,
    $schema: ConstantString.WrappedCardSchema,
    jsonPath: jsonPath,
    responseLayout: ConstantString.WrappedCardResponseLayout,
    responseCardTemplate: card,
    previewCardTemplate: {
      title: title,
      subtitle: subtitle,
    },
  };

  return result;
}

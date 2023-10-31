import {
  findTextinHTML,
  DOMParse,
  extractCommonText,
} from "~utils/html-parsing";
import { ResourceRange } from "~interfaces/main";
import { HTMLElement } from "node-html-parser";
import {
  testRecipeHTML,
  testIngredSpaceCaseHTML,
  testIngListnonBreakingSpaceHTML,
  testHtmlDuplication,
  testHtmlDuplication2,
  testHtmlDuplicationWithMissingIngredient,
} from "~utils/test-fixtures";

test("findTextinHTML correctly finds full text containing HTML '&nbsp;' ", () => {
  const htmlEl: HTMLElement = DOMParse(testIngredSpaceCaseHTML);
  const text = "350g cherry tomatoes (a mix of colours, if possible)";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl);

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1);
  // Check if extraction has properly worked (= includes HTML space)
  expect(
    (htmlEl.childNodes[output[0].elementNumber] as HTMLElement).innerHTML.slice(
      output[0].startCharacter,
      output[0].endCharacter,
    ),
  ).toEqual("350g cherry tomatoes (a mix of&nbsp;colours, if possible)");
});

test("findTextinHTML correctly ignores empty text ('') ", () => {
  const htmlEl: HTMLElement = DOMParse(testRecipeHTML);
  const text = "";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl);

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(0);
});

test("findTextinHTML correctly finds text in simple <h2>", () => {
  const htmlEl: HTMLElement = DOMParse(testRecipeHTML);
  const text = "Grilled pepper salad with fresh cucumber and herbs";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl);

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1);

  // Check if extracted text is correct
  expect(
    (htmlEl.childNodes[output[0].elementNumber] as HTMLElement).innerHTML.slice(
      output[0].startCharacter,
      output[0].endCharacter,
    ),
  ).toEqual(text);
});

test("findTextinHTML correctly finds text in nested <figure>", () => {
  const htmlEl: HTMLElement = DOMParse(testRecipeHTML);
  const text = "Yotam Ottolenghi";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl);

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1);

  // Check if extracted text is correct
  expect(
    (htmlEl.childNodes[output[0].elementNumber] as HTMLElement).innerHTML.slice(
      output[0].startCharacter,
      output[0].endCharacter,
    ),
  ).toEqual(text);
});

test("findTextinHTML correctly finds text (with markup) in simple steps <p>", () => {
  const htmlEl: HTMLElement = DOMParse(testRecipeHTML);

  const text = "Prep 20 min";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl);
  const desiredOutput = "Prep<strong> 20 min</strong>";

  const text2 = "Serves 4";
  const output2: ResourceRange[] = findTextinHTML(text2, htmlEl);
  const desiredOutput2 = "Serves <strong>4</strong>";

  const text3 = "Cook 40 min";
  const output3: ResourceRange[] = findTextinHTML(text3, htmlEl);
  const desiredOutput3 = "Cook <strong>40 min</strong>";

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1);
  expect(output2.length).toEqual(1);
  expect(output3.length).toEqual(1);

  // Check if extracted text is correct
  const extractedText = output.reduce((prev, o) => {
    const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
    return (prev = prev.concat(
      `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
    ));
  }, "");
  expect(extractedText.trim()).toEqual(desiredOutput);

  const extractedText2 = output2.reduce((prev, o) => {
    const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
    return (prev = prev.concat(
      `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
    ));
  }, "");
  expect(extractedText2.trim()).toEqual(desiredOutput2);

  const extractedText3 = output3.reduce((prev, o) => {
    const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
    return (prev = prev.concat(
      `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
    ));
  }, "");
  expect(extractedText3.trim()).toEqual(desiredOutput3);
});

test("findTextinHTML correctly finds ingredient text (with markup)", () => {
  const htmlEl: HTMLElement = DOMParse(testRecipeHTML);

  const ingredients = [
    "6 large garlic cloves peeled",
    "4 medium vine tomatoes (400g) each cut into 4 wedges",
    "90ml olive oil",
    "¾ tsp urfa chilli",
  ];
  const expectedOutputs = [
    "<strong>6 large garlic cloves</strong>, peeled",
    "<strong>4 medium vine tomatoes</strong><strong> (400g)</strong>, each cut into 4 wedges",
    "<strong>90ml olive oil</strong>",
    '<strong>¾ tsp <a href="https://ottolenghi.co.uk/urfa-chilli-flakes-shop" title="">urfa chilli</a></strong>',
  ];

  ingredients.forEach((ing, i) => {
    const output: ResourceRange[] = findTextinHTML(ing, htmlEl);

    // Check if correct amount of phrases extracted
    expect(output.length).toEqual(1);

    // Check if extracted text is correct
    const extractedText = output.reduce((prev, o) => {
      const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
      return (prev = prev.concat(
        `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
      ));
    }, "");
    expect(extractedText.trim()).toEqual(expectedOutputs[i]);
  });
});

test("findTextinHTML correctly extracts ingredient list title", () => {
  const htmlEl: HTMLElement = DOMParse(testRecipeHTML);
  const ingredTitle = "For the wasabi guacamole";
  const output: ResourceRange[] = findTextinHTML(ingredTitle, htmlEl);

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1);

  // Check if extracted ingredient title is correct
  const extractedText = output.reduce((prev, o) => {
    const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
    return (prev = prev.concat(
      `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
    ));
  }, "");
  expect(extractedText.trim()).toEqual(ingredTitle);
});

test("findTextinHTML correctly extracts ingredients when some ingredients are missing", () => {
  const htmlEl: HTMLElement = DOMParse(
    testHtmlDuplicationWithMissingIngredient,
  );
  const ingredients = [
    "Sticky apple balsamic spare ribs",
    "1.5kg free-range pork ribs (2 racks)",
    "4 tbsp redcurrant, plum, crab apple or other fruit jelly",
    "3 tbsp apple balsamic vinegar",
    "2 tbsp light muscovado sugar",
    "3 garlic cloves, crushed to a paste",
    "1 tbsp finely grated fresh ginger",
    "½-1 medium-hot red chilli, finely chopped, or ½ tsp dried chilli flakes",
    "2 tbsp soy sauce",
  ];

  const expectedOutputs = [
    "",
    "<strong>1.5kg free-range pork ribs (2&nbsp;racks) </strong>",
    "<strong>4 tbsp redcurrant, plum, crab apple or other fruit jelly</strong>",
    "<strong>3 tbsp apple balsamic vinegar</strong>",
    "<strong>2 tbsp light muscovado sugar</strong>",
    "<strong>3 garlic cloves, crushed to a paste</strong>",
    "<strong>1 tbsp finely grated fresh ginger</strong>",
    "<strong>½-1 medium-hot red chilli, finely chopped, or ½ tsp dried chilli flakes</strong>",
    "<strong>2 tbsp soy sauce </strong>",
  ];

  ingredients.forEach((ing, i) => {
    const output: ResourceRange[] = findTextinHTML(ing, htmlEl);

    // Check if correct amount of phrases extracted
    const expectedPhrases = expectedOutputs[i].length === 0 ? 0 : 1;
    expect(output.length).toEqual(expectedPhrases);

    // Check if extracted text is correct
    const extractedText = output.reduce((prev, o) => {
      const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
      return (prev = prev.concat(
        `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
      ));
    }, "");
    expect(extractedText.trim()).toEqual(expectedOutputs[i]);
  });
});

test("findTextinHTML does not trip for ingredients starting with same text", () => {
  const htmlEl: HTMLElement = DOMParse(testHtmlDuplication2);
  const ingredients = [
    "butter 175g",
    "plain flour 225g",
    "egg 1 yolk",
    "water 2-3 tbsp, cold",
    "banana shallots 5",
    "groundnut or other oil 1 tbsp",
    "plain flour 2 level tbsp",
    "double cream 250ml",
    "parsley 20g",
    "celeriac 150g (prepared weight)",
    "butter 30g, melted",
  ];

  const expectedOutputs = [
    "<strong>butter</strong> 175g",
    "<strong>plain flour</strong> 225g",
    "<strong>egg </strong>1 yolk",
    "<strong>water</strong> 2-3 tbsp, cold",
    "<strong>banana shallots</strong> 5",
    "<strong>groundnut or other oil</strong> 1 tbsp",
    "<strong>plain flour</strong> 2 level tbsp",
    "<strong>double cream</strong> 250ml",
    "<strong>parsley</strong> 20g",
    "<strong>celeriac</strong> 150g (prepared weight)",
    "<strong>butter</strong> 30g, melted",
  ];

  ingredients.forEach((ing, i) => {
    const output: ResourceRange[] = findTextinHTML(ing, htmlEl);

    // Check if correct amount of phrases extracted
    expect(output.length).toEqual(1);

    // Check if extracted text is correct
    const extractedText = output.reduce((prev, o) => {
      const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
      return (prev = prev.concat(
        `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
      ));
    }, "");

    expect(extractedText.trim()).toEqual(expectedOutputs[i]);
  });
});

test("findTextinHTML does not trip for ingredients starting with same first number", () => {
  const htmlEl: HTMLElement = DOMParse(testHtmlDuplication);

  const ingredients = [
    "500g salt cod",
    "600g potatoes, peeled and thinly sliced",
    "3 large shallots (or 2 red onions), thinly sliced",
    "1 garlic clove, crushed",
    "3 tbsp flat-leaf parsley, chopped",
    "Large pinch of dried oregano",
    "150g small plum tomatoes, chopped",
    "50g pecorino, grated",
    "50g seasoned breadcrumbs",
    "50ml olive oil",
    "Salt and black pepper",
  ];
  const expectedOutputs = [
    "500g salt cod",
    "600g potatoes, peeled and thinly sliced",
    "3 large shallots (or 2 red onions), thinly sliced",
    "1 garlic clove, crushed",
    "3 tbsp flat-leaf parsley, chopped",
    "Large pinch of dried oregano",
    "150g small plum tomatoes, chopped",
    "50g pecorino, grated",
    "50g seasoned breadcrumbs",
    "50ml olive oil",
    "Salt and black pepper",
  ];

  ingredients.forEach((ing, i) => {
    const output: ResourceRange[] = findTextinHTML(ing, htmlEl);

    // Check if correct amount of phrases extracted
    expect(output.length).toEqual(1);

    // Check if extracted text is correct
    const extractedText = output.reduce((prev, o) => {
      const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
      return (prev = prev.concat(
        `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
      ));
    }, "");
    expect(extractedText.trim()).toEqual(expectedOutputs[i]);
  });
});

test("Check partial matches", () => {
  const htmlEl: HTMLElement = DOMParse(testIngListnonBreakingSpaceHTML);
  const fullMatch =
    "<strong>1 medium courgette, grated (net&nbsp;weight 150g)</strong>";
  const partialMatch = "<strong>1 medium courgette, grated";

  const outputFull: ResourceRange[] = findTextinHTML(fullMatch, htmlEl);
  const outputPartial: ResourceRange[] = findTextinHTML(partialMatch, htmlEl);

  // Check if correct amount of phrases extracted
  expect(outputFull.length).toEqual(1);
  expect(outputPartial.length).toEqual(1);

  // Check if full match is correct
  const extractedText = outputFull.reduce((prev, o) => {
    const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
    return (prev = prev.concat(
      `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
    ));
  }, "");
  expect(extractedText.trim()).toEqual(fullMatch);

  // Check if partial match is correct
  const extractedPartialText = outputPartial.reduce((prev, o) => {
    const el = htmlEl.childNodes[o.elementNumber] as HTMLElement;
    return (prev = prev.concat(
      `${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `,
    ));
  }, "");
  expect(extractedPartialText.trim()).toEqual(partialMatch);
});

test("extractCommonText correctly gets common text from two strings", () => {
  const text1 = "<strong>4 green peppers</strong>, ";
  const text2 =
    "</strong>, stems removed, deseeded and flesh cut into roughly 3cm pieces<br>";

  // Check if correct amount of phrases extracted
  expect(extractCommonText(text1, text2)).toEqual("</strong>, ");
});

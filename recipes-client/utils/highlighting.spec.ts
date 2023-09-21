import { Highlight, ResourceRange } from '../interfaces/main';
import { DOMParse, findTextinHTML } from "../utils/html-parsing";
import { createHighlightTextFractions, mergeHighlights, markHTML, createHighlightHTML } from "../utils/highlighting";
import { HTMLElement } from 'node-html-parser';
import {
  testIngListHTML, testHtmlDuplication, testHtmlDuplication2,
  markupHtmlDuplication, markupHtmlDuplication2, testHtmlDuplicationWithMissingIngredient,
  markupHtmlDuplicationWithMissingIngredient
} from '../utils/test-fixtures';


test("Create text correct fractions for highlighting ", () => {
  const highlightInfo = [{ id: 'test', type: "test", range: { elementNumber: 0, startCharacter: 0, endCharacter: 35 } }] as Highlight[]
  const [before, inside, after] = createHighlightTextFractions(highlightInfo, testIngListHTML)
  expect(before[0] + inside[0] + after[0]).toEqual(testIngListHTML)
})

test("Merge fractions correctly ", () => {
  const highlightInfo = [{ id: 'test', type: "test", range: { elementNumber: 0, startCharacter: 0, endCharacter: 35 } }] as Highlight[]
  const [before, inside, after] = createHighlightTextFractions(highlightInfo, testIngListHTML)
  const merged = mergeHighlights(before, inside, after)
  expect(merged.replace(/\s/g, '')).toEqual(testIngListHTML.replace(/\s/g, ''))
})

test("Mark HTML correctly", () => {
  const highlights: Highlight[] = [{ id: 'test', type: "test", range: { elementNumber: 0, startCharacter: 0, endCharacter: 35 } }] as Highlight[]
  const colours: Record<string, string> = { "test": "green" };
  const expectedMarkupText = `1 medium courgette, grated ${highlights[0].type} (net weight 150g)`
  const expectedAfterMarkup = `(net&nbsp;weight 150g)</strong><br>
    <strong>½ large cucumber, grated (net&nbsp;weight 150g)</strong><br>
    <strong>Coarse sea salt and black pepper</strong><br>
    <strong>8 dried kaffir lime leaves</strong><br>
    <strong>250g Greek yogurt</strong><br>
    <strong>20g unsalted butter</strong><br>
    <strong>1½ tsp lime juice</strong><br>
    <strong>1 tbsp shredded mint leaves</strong><br>
    <strong>1 clove garlic, peeled and crushed</strong>
    `;

  const [before, inside, after] = createHighlightTextFractions(highlights, testIngListHTML);

  const highlightType = highlights[0].type;
  const lastInSpan = true;
  const altered = [markHTML(inside[0].trim(), highlightType, colours[highlightType], lastInSpan)];

  const ttEl: HTMLElement = DOMParse(before[0] + altered[0] + after[0])
  const sel = ttEl.querySelectorAll(".test");

  // Correct number of nodes found?
  expect(sel.length).toEqual(1);
  // Correct markup text?
  expect(sel[0].firstChild.text.replace(/\s/g, '')).toEqual(expectedMarkupText.replace(/\s/g, ''))
  // Correct text outside markup?
  expect(after[0].replace(/\s/g, '')).toEqual(expectedAfterMarkup.replace(/\s/g, ''))
})

test("No duplication in ingredients fields ", () => {
  const htmlEl: HTMLElement = DOMParse(testHtmlDuplication)
  const htmlNodes = (Array.from(htmlEl.childNodes) as HTMLElement[]);

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
    "Salt and black pepper"
  ]

  const output: ResourceRange[] = ingredients.reduce((acc, ing) => {
    return [...acc, ...findTextinHTML(ing, htmlEl)];
  }, [] as ResourceRange[]);

  const output: ResourceRange[] = ingredients.reduce((acc, ing) => {
    return [...acc, ...findTextinHTML(ing, htmlEl)]
  }, [] as ResourceRange[]);

  const highlightInfo: Highlight[] = output.map((o, i) => {
    return {
      id: `test_${i}`,
      type: "test",
      range: {
        elementNumber: 0,
        startCharacter: o.startCharacter,
        endCharacter: o.endCharacter
      }
    }
  })

  // Explicitly check steps in 'createHighlightHTML' function code
  const [before, inside, after] = createHighlightTextFractions(highlightInfo, htmlNodes[0].innerHTML)
  const merged = mergeHighlights(before, inside, after)
  expect(merged.replace(/\s/g, '')).toEqual(htmlNodes[0].innerHTML.replace(/\s/g, ''))

  // Check 'createHighlightHTML' function as a whole
  const result = createHighlightHTML(highlightInfo, htmlNodes[0], { 'test': 'yellow' });
  expect(result.replace(/\s/g, "")).toEqual(markupHtmlDuplication.replace(/\s/g, "").replace(/"/g, '"'))

})

test("No duplication in ingredients fields with reverse order ", () => {
  const htmlEl: HTMLElement = DOMParse(testHtmlDuplication2)
  const htmlNodes = (Array.from(htmlEl.childNodes) as HTMLElement[]);

  const ingredients = [
    'butter 175g',
    'plain flour 225g',
    'egg 1 yolk',
    'water 2-3 tbsp, cold',
    'banana shallots 5',
    'groundnut or other oil 1 tbsp',
    'plain flour 2 level tbsp',
    'double cream 250ml',
    'parsley 20g',
    'celeriac 150g (prepared weight)',
    'butter 30g, melted'
  ]

  const output: ResourceRange[] = ingredients.reduce((acc, ing) => {
    return [...acc, ...findTextinHTML(ing, htmlEl)];
  }, [] as ResourceRange[]);

  const output: ResourceRange[] = ingredients.reduce((acc, ing) => {
    return [...acc, ...findTextinHTML(ing, htmlEl)]
  }, [] as ResourceRange[]);

  const highlightInfo: Highlight[] = output.map((o, i) => {
    return {
      id: `test_${i}`,
      type: "test",
      range: {
        elementNumber: 0,
        startCharacter: o.startCharacter,
        endCharacter: o.endCharacter
      }
    }
  })

  // Explicitly check steps in 'createHighlightHTML' function code)
  const [before, inside, after] = createHighlightTextFractions(highlightInfo, htmlNodes[0].innerHTML)
  const merged = mergeHighlights(before, inside, after)
  expect(merged.replace(/\s/g, '')).toEqual(htmlNodes[0].innerHTML.replace(/\s/g, ''))

  // Check 'createHighlightHTML' function as a whole
  const result = createHighlightHTML(highlightInfo, htmlNodes[0], { 'test': 'yellow' });
  expect(result.replace(/\s/g, "")).toEqual(markupHtmlDuplication2.replace(/\s/g, "").replace(/"/g, '"'))

})

test("No duplication in ingredients field when skipping ingredient ", () => {
  const htmlEl: HTMLElement = DOMParse(testHtmlDuplicationWithMissingIngredient)
  const htmlNodes = (Array.from(htmlEl.childNodes) as HTMLElement[]);

  const ingredients = [
    "Sticky apple balsamic spare ribs",
    "1.5kg free-range pork ribs (2 racks)",
    "4 tbsp redcurrant, plum, crab apple or other fruit jelly",
    "3 tbsp apple balsamic vinegar",
    "2 tbsp light muscovado sugar",
    "3 garlic cloves, crushed to a paste",
    "1 tbsp finely grated fresh ginger",
    "½-1 medium-hot red chilli, finely chopped, or ½ tsp dried chilli flakes",
    "2 tbsp soy sauce"
  ]

  const output: ResourceRange[] = ingredients.reduce((acc, ing) => {
    return [...acc, ...findTextinHTML(ing, htmlEl)];
  }, [] as ResourceRange[]);

  const output: ResourceRange[] = ingredients.reduce((acc, ing) => {
    return [...acc, ...findTextinHTML(ing, htmlEl)]
  }, [] as ResourceRange[]);

  const highlightInfo: Highlight[] = output.map((o, i) => {
    return {
      id: `test_${i}`,
      type: "test",
      range: {
        elementNumber: 1,
        startCharacter: o.startCharacter,
        endCharacter: o.endCharacter
      }
    }
  })

  // Explicitly check steps in 'createHighlightHTML' function code
  const [before, inside, after] = createHighlightTextFractions(highlightInfo, htmlNodes[1].innerHTML)
  const merged = mergeHighlights(before, inside, after)
  expect(merged.replace(/\s/g, '')).toEqual(htmlNodes[1].innerHTML.replace(/\s/g, ''))

  // Check 'createHighlightHTML' function as a whole
  const result = createHighlightHTML(highlightInfo, htmlNodes[1], { 'test': 'yellow' });
  expect(result.replace(/\s/g, "")).toEqual(markupHtmlDuplicationWithMissingIngredient.replace(/\s/g, "").replace(/"/g, '"'))

})

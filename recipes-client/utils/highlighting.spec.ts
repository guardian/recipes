import { Highlight } from '~interfaces/main';
import { DOMParse } from "~utils/html-parsing";
import { createHighlightTextFractions, mergeHighlights, markHTML } from "~utils/highlighting";
import { HTMLElement } from 'node-html-parser';


const testHTML = `
<strong>1 medium courgette, grated (net&nbsp;weight 150g)</strong><br>
<strong>½ large cucumber, grated (net&nbsp;weight 150g)</strong><br>
<strong>Coarse sea salt and black pepper</strong><br>
<strong>8 dried kaffir lime leaves</strong><br>
<strong>250g Greek yogurt</strong><br>
<strong>20g unsalted butter</strong><br>
<strong>1½ tsp lime juice</strong><br>
<strong>1 tbsp shredded mint leaves</strong><br>
<strong>1 clove garlic, peeled and crushed</strong>
`


test("Create text correct fractions for highlighting ", () => {
    const highlightInfo = [{ id: 'test', type: "test", range: {elementNumber: 1, startCharacter: 1, endCharacter: 35 }}] as Highlight[]
    const [before, inside, after] = createHighlightTextFractions(highlightInfo, testHTML)
    expect(before[0]+inside[0]+after[0]).toEqual(testHTML)
})

test("Merge fractions correctly ", () => {
    const highlightInfo = [{ id: 'test', type: "test", range: {elementNumber: 1, startCharacter: 1, endCharacter: 35 }}] as Highlight[]
    const [before, inside, after] = createHighlightTextFractions(highlightInfo, testHTML)
    const merged = mergeHighlights(before, inside, after)
    expect(merged.replace(/\s/g, '')).toEqual(testHTML.replace(/\s/g, ''))
})

test("Mark HTML correctly", () => {
    const highlights: Highlight[] = [{ id: 'test', type: "test", range: {elementNumber: 1, startCharacter: 1, endCharacter: 35 }}] as Highlight[]
    const colours: Record<string, string> = {"test": "green"};
    const expectedMarkupText = `1 medium courgette, grated ${highlights[0].type as string} (net weight 150g)`
    const expectedAfterMarkup = `(net&nbsp;weight 150g)</strong><br>
    <strong>½ large cucumber, grated (net&nbsp;weight 150g)</strong><br>
    <strong>Coarse sea salt and black pepper</strong><br>
    <strong>8 dried kaffir lime leaves</strong><br>
    <strong>250g Greek yogurt</strong><br>
    <strong>20g unsalted butter</strong><br>
    <strong>1½ tsp lime juice</strong><br>
    <strong>1 tbsp shredded mint leaves</strong><br>
    <strong>1 clove garlic, peeled and crushed</strong>
    `

    const [before, inside, after] = createHighlightTextFractions(highlights, testHTML);

    const highlightType = (highlights[0].type as string);
    const lastInSpan = true; 
    const altered = [markHTML(inside[0].trim(), highlightType, colours[highlightType], lastInSpan)];

    const ttEl: HTMLElement = DOMParse(before[0]+altered[0]+after[0])
    const sel = ttEl.querySelectorAll(".test");

    // Correct number of nodes found?
    expect(sel.length).toEqual(1);
    // Correct markup text?
    expect(sel[0].firstChild.text.replace(/\s/g, '')).toEqual(expectedMarkupText.replace(/\s/g, ''))
    // Correct text outside markup?
    expect(after[0].replace(/\s/g, '')).toEqual(expectedAfterMarkup.replace(/\s/g, ''))
})

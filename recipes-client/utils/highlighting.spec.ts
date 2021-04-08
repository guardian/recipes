import { Highlight, ResourceRange } from '~interfaces/main';
import { DOMParse, findTextinHTML } from "~utils/html-parsing";
import { createHighlightTextFractions, mergeHighlights, markHTML, createHighlightHTML } from "~utils/highlighting";
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

const testHtmlDuplication = `
<p>
500g salt cod <br>
600g potatoes, peeled and thinly sliced<br>
3 large shallots (or 2 red onions), thinly sliced <br>
1 garlic clove, crushed<br>3 tbsp flat-leaf parsley, chopped<br>
Large pinch of dried oregano<br>150g small plum tomatoes, chopped <br>
50g pecorino, grated<br>
50g seasoned breadcrumbs <br>
50ml olive oil<br>
Salt and black pepper</p>
`.replace(/\n/g, '')

const markupHtmlDuplication = `
<mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">500g salt cod
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark>  <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">600g potatoes, peeled and thinly sliced
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark> <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">3 large shallots (or 2 red onions), thinly sliced
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark>  <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">1 garlic clove, crushed
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark> <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">3 tbsp flat-leaf parsley, chopped
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark> <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">Large pinch of dried oregano
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark> <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">150g small plum tomatoes, chopped
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark>  <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">50g pecorino, grated
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark> <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">50g seasoned breadcrumbs
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark>  <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">50ml olive oil
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark> <br> <mark class="test" style="background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">Salt and black pepper
        <span style="font-size: 0.7em; font-weight: bold; line-height: 1; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; margin-left: 0.5rem position: relative; top: 0.5em; position: relative;">test</span>
        </mark>`

test("Create text correct fractions for highlighting ", () => {
    const highlightInfo = [{ id: 'test', type: "test", range: {elementNumber: 0, startCharacter: 0, endCharacter: 35 }}] as Highlight[]
    const [before, inside, after] = createHighlightTextFractions(highlightInfo, testHTML)
    expect(before[0]+inside[0]+after[0]).toEqual(testHTML)
})

test("Merge fractions correctly ", () => {
    const highlightInfo = [{ id: 'test', type: "test", range: {elementNumber: 0, startCharacter: 0, endCharacter: 35 }}] as Highlight[]
    const [before, inside, after] = createHighlightTextFractions(highlightInfo, testHTML)
    const merged = mergeHighlights(before, inside, after)
    expect(merged.replace(/\s/g, '')).toEqual(testHTML.replace(/\s/g, ''))
})

test("Mark HTML correctly", () => {
    const highlights: Highlight[] = [{ id: 'test', type: "test", range: {elementNumber: 0, startCharacter: 0, endCharacter: 35 }}] as Highlight[]
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
        return [...acc, ...findTextinHTML(ing, htmlEl)]
     }, [] as ResourceRange[]);

    const highlightInfo: Highlight[] = output.map((o, i) => { return { id: `test_${i}`, 
                                                  type: "test", 
                                                  range: {elementNumber: 0, 
                                                          startCharacter: o.startCharacter, 
                                                          endCharacter: o.endCharacter }
                                                }
                                            })

    // Explicitely check steps in 'createHighlightHTML' function code
    const [before, inside, after] = createHighlightTextFractions(highlightInfo, htmlNodes[0].innerHTML)
    const merged = mergeHighlights(before, inside, after)
    expect(merged.replace(/\s/g, '')).toEqual(htmlNodes[0].innerHTML.replace(/\s/g, ''))

    // Check 'createHighlightHTML' function as a whole
    const result = createHighlightHTML(highlightInfo, htmlNodes[0], {'test':'yellow'});
    expect (result.replace(/\s/g, "")).toEqual(markupHtmlDuplication.replace(/\s/g, "").replace(/"/g, '"'))

})
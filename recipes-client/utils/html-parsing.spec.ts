import { findTextinHTML, DOMParse, extractCommonText } from "~utils/html-parsing";
import { ResourceRange } from "~interfaces/main";
import { HTMLElement } from 'node-html-parser';

const testHTML = `
<p>All food is a celebration of something, but some dishes are especially celebratory. What makes them so? For me, they
  have to have a built-in “ta-da!” factor, and anything that you need to flip over, inverting it from a pan and on to a
  platter, helps no end with that. Savoury dishes with the word “cake” in their name also tend to please, as do ones
  with layers. These are just some of the things that make a dish “celebratory” for me, and there will be more for
  others still. One thing is a must, though: it should be very hard to walk into a room holding a celebratory dish
  without emitting a little whoop.</p>
<h2>Grilled pepper salad with fresh cucumber and herbs</h2>
<figure class="element element-image" data-media-id="f030fdded18725c9467738aac77a24e1f6e4a00f"> 
  <img src="https://media.guim.co.uk/f030fdded18725c9467738aac77a24e1f6e4a00f/3_0_3678_3678/1000.jpg" alt="Yotam Ottolenghi’s pepper salad with cucumber and herbs." width="1000" height="1000" class="gu-image" > 
  <figcaption> <span class="element-image__caption">Yotam Ottolenghi’s grilled pepper salad with cucumber and herbs.</span> 
  <span class="element-image__credit">Photograph: Louise Hagger/The Guardian</span> </figcaption> 
</figure>
<p>Prep<strong> 20 min</strong><br>Cook <strong>40 min</strong><br>Serves <strong>4</strong></p>
<p><strong>4 green peppers</strong>, stems removed, deseeded and flesh cut into roughly 3cm pieces<br>
   <strong>2 red peppers</strong>, stems removed, deseeded and flesh cut into roughly 3cm pieces<br>
   <strong>4 medium vine tomatoes</strong><strong> (400g)</strong>, each cut into 4 wedges<br>
   <strong>2 small red onions</strong>, peeled and cut into roughly 3cm pieces<br>
   <strong>1 green chilli</strong>, roughly sliced, seeds and all<strong> </strong><br>
   <strong>6 large garlic cloves</strong>, peeled<br><strong>90ml olive oil</strong><br>
   <strong>Salt and black pepper</strong><br><strong>1½ tbsp lemon juice</strong><br>
   <strong>10g parsley leaves</strong>, roughly chopped<br>
   <strong>10g coriander leaves</strong>, roughly chopped<br>
   <strong>1 cucumber</strong>, peeled, deseeded and cut into 1cm cubes<br>
   <strong>¾ tsp <a href="https://ottolenghi.co.uk/urfa-chilli-flakes-shop" title="">urfa chilli</a></strong>
</p>
<p><p>For the wasabi guacamole<br>
    <strong>2 ripe avocados, peeled (net&nbsp;weight&nbsp;300g) </strong><br>
    <strong>2 tbsp lime juice</strong>
    <br><strong>2 tsp wasabi paste </strong><br>
    <strong>20g chopped spring onion</strong><br>
    <strong>Salt</strong>
  </p></p>
`

const testHTMLSpaceCase = `
  <strong>350g cherry tomatoes (a mix of&nbsp;colours, if possible)</strong>
`

const testUnmatchedParetheses = `
<p>
<strong>1 medium courgette, grated (net&nbsp;weight 150g)</strong><br>
<strong>½ large cucumber, grated (net&nbsp;weight 150g)</strong><br>
<strong>Coarse sea salt and black pepper</strong><br>
<strong>8 dried kaffir lime leaves</strong><br>
<strong>250g Greek yogurt</strong><br>
<strong>20g unsalted butter</strong><br>
<strong>1½ tsp lime juice</strong><br>
<strong>1 tbsp shredded mint leaves</strong><br>
<strong>1 clove garlic, peeled and crushed</strong>
</p>
`

test("findTextinHTML correctly finds full text containing HTML '&nbsp;' ", () => {
  const htmlEl: HTMLElement = DOMParse(testHTMLSpaceCase)
  const text = "350g cherry tomatoes (a mix of colours, if possible)";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1)
  // Check if extraction has properly worked (= includes HTML space)
  expect((htmlEl.childNodes[output[0].elementNumber] as HTMLElement).innerHTML.slice(output[0].startCharacter, output[0].endCharacter)
        ).toEqual("350g cherry tomatoes (a mix of&nbsp;colours, if possible)");
});

test("findTextinHTML correctly ignores empty text ('') ", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML)
  const text = "";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(0)

});

test("findTextinHTML correctly finds text in simple <h2>", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML)
  const text = "Grilled pepper salad with fresh cucumber and herbs";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1)

  // Check if extracted text is correct
  expect((htmlEl.childNodes[output[0].elementNumber] as HTMLElement).innerHTML.slice(output[0].startCharacter, output[0].endCharacter)
        ).toEqual(text);
});


test("findTextinHTML correctly finds text in nested <figure>", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML)
  const text = "Yotam Ottolenghi";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1)

  // Check if extracted text is correct
  expect((htmlEl.childNodes[output[0].elementNumber] as HTMLElement).innerHTML.slice(output[0].startCharacter, output[0].endCharacter)
        ).toEqual(text);
});

test("findTextinHTML correctly finds text (with markup) in simple steps <p>", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML)
  
  const text = "Prep 20 min";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl)
  const desiredOutput = "Prep<strong> 20 min</strong>";

  const text2 = "Serves 4";
  const output2: ResourceRange[] = findTextinHTML(text2, htmlEl)
  const desiredOutput2 = "Serves <strong>4</strong>";

  const text3 = "Cook 40 min"
  const output3: ResourceRange[] = findTextinHTML(text3, htmlEl)
  const desiredOutput3 = "Cook <strong>40 min</strong>"

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1)
  expect(output2.length).toEqual(1)
  expect(output3.length).toEqual(1)


  // Check if extracted text is correct
  const extractedText = output.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText.trim()).toEqual(desiredOutput);

  const extractedText2 = output2.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText2.trim()).toEqual(desiredOutput2);

  const extractedText3 = output3.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText3.trim()).toEqual(desiredOutput3);
});


test("findTextinHTML correctly finds ingredient text (with markup)", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML)

  const ingredients = [
    "6 large garlic cloves peeled",
    "4 medium vine tomatoes (400g) each cut into 4 wedges",
    "90ml olive oil",
    "¾ tsp urfa chilli"
  ]
  const expectedOutputs = [
    "<strong>6 large garlic cloves</strong>, peeled",
    "<strong>4 medium vine tomatoes</strong><strong> (400g)</strong>, each cut into 4 wedges",
    "<strong>90ml olive oil</strong>",
    "<strong>¾ tsp <a href=\"https://ottolenghi.co.uk/urfa-chilli-flakes-shop\" title=\"\">urfa chilli</a></strong>"
  ]

  ingredients.forEach((ing, i) => {
    const output: ResourceRange[] = findTextinHTML(ing, htmlEl)

    // Check if correct amount of phrases extracted
    expect(output.length).toEqual(1)

    // Check if extracted text is correct
    const extractedText = output.reduce((prev, o) => {
      const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
      return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
    }, '')
    expect(extractedText.trim()).toEqual(expectedOutputs[i]);

  });
});

test("findTextinHTML correctly extracts ingredient list title", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML);
  const ingredTitle = "For the wasabi guacamole";
  const output: ResourceRange[] = findTextinHTML(ingredTitle, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1)

  // Check if extracted ingredient title is correct
  const extractedText = output.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText.trim()).toEqual(ingredTitle);
});


test("Check partial matches", () => {
  const htmlEl: HTMLElement = DOMParse(testUnmatchedParetheses);
  const fullMatch = "<strong>1 medium courgette, grated (net&nbsp;weight 150g)</strong>"
  const partialMatch = "<strong>1 medium courgette, grated"

  const outputFull: ResourceRange[] = findTextinHTML(fullMatch, htmlEl)
  const outputPartial: ResourceRange[] = findTextinHTML(partialMatch, htmlEl)

  // Check if correct amount of phrases extracted
  expect(outputFull.length).toEqual(1)
  expect(outputPartial.length).toEqual(1)

  // Check if full match is correct
  const extractedText = outputFull.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText.trim()).toEqual(fullMatch);

  // Check if partial match is correct
  const extractedPartialText = outputPartial.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedPartialText.trim()).toEqual(partialMatch);

});


test("extractCommonText correctly get common text from two strings", () => {
  const text1 = "<strong>4 green peppers</strong>, ";
  const text2 = "</strong>, stems removed, deseeded and flesh cut into roughly 3cm pieces<br>";

  // Check if correct amount of phrases extracted
  expect(extractCommonText(text1, text2)).toEqual("</strong>, ")

});
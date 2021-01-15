import { findTextinHTML, DOMParse, extractCommonText } from "~utils/html-parsing";
import { ResourceRange } from "~components/interfaces";
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
`


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
  // const htmlEl: HTMLElement = DOMParse(`<figure class=\"element element-image\" data-media-id=\"f030fdded18725c9467738aac77a24e1f6e4a00f\"> 
  //   <img src=\"https://media.guim.co.uk/f030fdded18725c9467738aac77a24e1f6e4a00f/3_0_3678_3678/1000.jpg\" alt=\"Yotam Ottolenghi’s pepper salad with cucumber and herbs.\" width=\"1000\" height=\"1000\" class=\"gu-image\" > 
  //   <figcaption> <span class=\"element-image__caption\">Yotam Ottolenghi’s grilled pepper salad with cucumber and herbs.</span> 
  //   <span class=\"element-image__credit\">Photograph: Louise Hagger/The Guardian</span> </figcaption> </figure>`)
  const htmlEl: HTMLElement = DOMParse(testHTML)
  const text = "Yotam Ottolenghi";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(1)

  // Check if extracted text is correct
  expect((htmlEl.childNodes[output[0].elementNumber] as HTMLElement).innerHTML.slice(output[0].startCharacter, output[0].endCharacter)
        ).toEqual(text);
});

test("findTextinHTML correctly finds text in simple steps <p>", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML)
  
  const text = "Prep 20 min";
  const output: ResourceRange[] = findTextinHTML(text, htmlEl)

  const text2 = "Serves 4";
  const output2: ResourceRange[] = findTextinHTML(text2, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(3)
  expect(output2.length).toEqual(2)

  // Check if extracted text is correct
  const extractedText = output.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText.trim()).toEqual(text);

  const extractedText2 = output2.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText2.trim()).toEqual(text2);
});


test("findTextinHTML correctly finds ingredient text", () => {
  const htmlEl: HTMLElement = DOMParse(testHTML)

  const text = "6 large garlic cloves peeled";
  const text2 = "4 medium vine tomatoes (400g) each cut into 4 wedges"

  const output: ResourceRange[] = findTextinHTML(text, htmlEl)
  const output2: ResourceRange[] = findTextinHTML(text2, htmlEl)

  // Check if correct amount of phrases extracted
  expect(output.length).toEqual(5)
  expect(output2.length).toEqual(10)

  // Check if extracted text is correct
  const extractedText = output.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText.trim()).toEqual(text);

  const extractedText2 = output2.reduce((prev, o) => {
    const el = (htmlEl.childNodes[o.elementNumber] as HTMLElement);
    return prev = prev.concat(`${el.innerHTML.slice(o.startCharacter, o.endCharacter)} `)
  }, '')
  expect(extractedText2.trim()).toEqual(text2);
});

test("extractCommonText correctly get common text from two strings", () => {
  const text1 = "<strong>4 green peppers</strong>, ";
  const text2 = "</strong>, stems removed, deseeded and flesh cut into roughly 3cm pieces<br>";

  // Check if correct amount of phrases extracted
  expect(extractCommonText(text1, text2)).toEqual("</strong>, ")

});
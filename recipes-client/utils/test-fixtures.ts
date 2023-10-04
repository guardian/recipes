/*
  Fixtures for unit tests
  STRONG DEPENDENCY OF MARKUP STYLING
  TODO: de-couple this dependency better.
*/
import { body } from '@guardian/source-foundations';

export const testRecipeHTML = `
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
  <span class="element-image__byline">Photograph: Louise Hagger/The Guardian</span> </figcaption>
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
`;

export const testIngListHTML = `
<strong>1 medium courgette, grated (net&nbsp;weight 150g)</strong><br>
<strong>½ large cucumber, grated (net&nbsp;weight 150g)</strong><br>
<strong>Coarse sea salt and black pepper</strong><br>
<strong>8 dried kaffir lime leaves</strong><br>
<strong>250g Greek yogurt</strong><br>
<strong>20g unsalted butter</strong><br>
<strong>1½ tsp lime juice</strong><br>
<strong>1 tbsp shredded mint leaves</strong><br>
<strong>1 clove garlic, peeled and crushed</strong>
`.replace(/\n/g, '');

export const testIngredSpaceCaseHTML = `
  <strong>350g cherry tomatoes (a mix of&nbsp;colours, if possible)</strong>
`;

export const testIngListnonBreakingSpaceHTML = `
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
`;

export const testHtmlDuplication = `
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
`.replace(/\n/g, '');

export const markupHtmlDuplication = `
<mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">500g salt cod
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">600g potatoes, peeled and thinly sliced
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">3 large shallots (or 2 red onions), thinly sliced
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">1 garlic clove, crushed
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">3 tbsp flat-leaf parsley, chopped
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">Large pinch of dried oregano
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">150g small plum tomatoes, chopped
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">50g pecorino, grated
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">50g seasoned breadcrumbs
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">50ml olive oil
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;">Salt and black pepper
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>
`.replace(/\n/g, '');

export const testHtmlDuplicationWithMissingIngredient = `
<p>These sticky ribs are near-addictively good, and incredibly easy to make. Serves four to six.</p>
<p><strong>1.5kg free-range pork ribs (2&nbsp;racks) </strong><br>
For the marinade<br><strong>4 tbsp redcurrant, plum, crab apple or other fruit jelly</strong><br>
<strong>3 tbsp apple balsamic vinegar</strong><br>
<strong>2 tbsp light muscovado sugar</strong><br>
<strong>3 garlic cloves, crushed to a paste</strong><br>
<strong>1 tbsp finely grated fresh ginger</strong><br>
<strong>½-1 medium-hot red chilli, finely chopped, or ½ tsp dried chilli flakes</strong><br>
<strong>2 tbsp soy sauce </strong><br>
<strong>Steamed rice and wilted greens, to&nbsp;serve </strong>
</p>
`.replace(/\n/g, '');

export const markupHtmlDuplicationWithMissingIngredient = `
<mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>1.5kg free-range pork ribs (2&nbsp;racks) </strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br>For the marinade<br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>4 tbsp redcurrant, plum, crab apple or other fruit jelly</strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>3 tbsp apple balsamic vinegar</strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>2 tbsp light muscovado sugar</strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>3 garlic cloves, crushed to a paste</strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>1 tbsp finely grated fresh ginger</strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>½-1 medium-hot red chilli, finely chopped, or ½ tsp dried chilli flakes</strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>2 tbsp soy sauce </strong>
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark><br>
<strong>Steamed rice and wilted greens, to&nbsp;serve </strong>
`;

export const testHtmlDuplication2 = `
<p>Serves 6<br>
For the pastry:<br>
<strong>butter</strong> 175g <br>
<strong>plain flour</strong> 225g<br>
<strong>egg </strong>1 yolk<br>
<strong>water</strong> 2-3 tbsp, cold<br>
<br>
For the filing:<br>
<strong>banana shallots</strong> 5 <br>
<strong>groundnut or other oil</strong> 1 tbsp <br>
<strong>gammon</strong> smoked or not, trimmed, 650g<br>
<strong>plain flour</strong> 2 level tbsp<br>
<strong>double cream</strong> 250ml <br>
<strong>parsley</strong> 20g<br>
<strong>celeriac</strong> 150g (prepared weight)<br>
<strong>butter</strong> 30g, melted<br></p>
`.replace(/\n/g, '');

export const markupHtmlDuplication2 = `
Serves 6<br>For the pastry:<br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>butter</strong> 175g
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>plain flour</strong> 225g
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>egg </strong>1 yolk
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>water</strong> 2-3 tbsp, cold
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br><br>For the filing:<br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>banana shallots</strong> 5
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>groundnut or other oil</strong> 1 tbsp
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br><strong>gammon</strong> smoked or not, trimmed, 650g<br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>plain flour</strong> 2 level tbsp
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>double cream</strong> 250ml
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark>  <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>parsley</strong> 20g
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>celeriac</strong> 150g (prepared weight)
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark> <br> <mark class="test" style="${body.medium()}; background: yellow; padding: 0.25em 0.6em; margin: 0 0.25em; line-height: 1; border-radius: 0.15em;"><strong>butter</strong> 30g, melted
<span style="${body.small()}; font-size: 0.7em; font-weight: bold; line-height: 2; border-radius: 0.35em; text-transform: uppercase; vertical-align: middle; top: 0.5em; position: relative;">test</span>
</mark><br>`;

# The Internet as an Eternally Decaying Garden: CSCI1377 Demo

## Interaction

The site will consist of a series of interstitial commentary blocks that the user navigates through (reading)
before entering into a 'browser' of sorts that embeds pages of meaningful information from the Internet,
likely on related archival concepts as a form of meta commentary. During these interactive sections, the user
has a short amount of time (on the order of 2-3 minutes) to _read_ and _preserve._ Preservation consists of using
a limited budget of highlights/notes that the user can choose to 'save' which will prevent the page rot.

As users explore through pages, what they choose to preserve will be saved into a hypertextual index.
At the end of their preservation/archiving journey, they'll have the opportunity to look back on
what they chose to preserve, what was lost, and the overall hypertextual structure of their preservation
(which pages connected with links, which links rotted away, etc.)

## Design

The design of the site will follow somewhat of an old-aesthetic vintage browser-like fashion, with the
navigation screen of the archiver being a sort of browser-in-browser. Think Windows Vista or Hypnospace Outlaw, if you're cool like that.
The presentation of link rot will be in that of physical rot, with the user actively seeing the page fall apart around them.
Interstitial commentary/narrative/essay-like blocks will appear as popups over the user's browser (embedded in the page, or actual)
that serve to explain concepts, give historical anecdotes, or prompt reflection.

## Alex Thoughts:

The participants will need some kind of guiding goal or principle to help them decide what to preserve, 
and ideally there's some way at the end that they can understand what they missed
and what the impacts of failing to preserve it would be. Is there a way to mechanistically gauge 'success' here, 
or information lost? Maybe we could index pages for core concepts in some manner.

## Brainstorm sesh for summary page
Archive reciept/list 
* shows every saved item in the order it was saved, like a receipt or print log
* each entry shows the source URL, the text or image, and a timestamp of when it was saved?
* items saved later in the timer would visually appear more degraded - more glitchy characters, faded text
* feels like finding a damaged printout in a filing cabinet
* pros: fits the decayed aesthetic, chronological order tells a story of how the user moved through the content
* cons: doesn't show what was lost, just what was saved, so the emotional impact of link rot is weaker, can feel like just a list without deeper meaning

Split screen (inspired by git diff)
* splits the screen into two columns: left is what you saved, right is what rotted away
* the right column shows grey placeholder blocks sized roughly to how much text was lost
* a percentage at the top like "you preserved x% of available content" makes the loss feel concrete
* pros: directly shows the user with what they missed, the visual contrast between saved and lost is powerful, percentage gives a numeric/score-like feeling
* cons: requires knowing the total amount of content available to calculate what was lost, so would need to store the full text of every page somewhere to compare against (?)

Annotated index
* groups saved items by their source URL, like the index at the back of an academic book
* each URL is a header, with its saved fragments listed beneath it as short references
* clicking a reference expands it to show the full saved text
* URLs that were visited but had nothing saved are listed at the bottom marked as lost
* pros: indexing fits the archival theme well, grouping by source makes it easy to see where you spent your time, showing visited-but-unsaved URLs adds the sense of loss without needing to know full page content
* cons: requires tracking which URLs were visited even when nothing was saved, the expand-to-read interaction could be a bit complicated depending on how we decide to implement, perhaps not as visual
"use client";

import { ReactNode } from "react";

interface OutroContentProps {
  completedSetId: number; // the id of the set that just finished
  onContinue: () => void;
}

const OUTRO_COPY: Record<number, { heading: ReactNode; body: ReactNode }> = {
  1: {
    heading: (
      <h1>
        <span className="redac-reg">Debrief 1 // </span>
        <span className="redac-20">Timescales</span>
        <span className="redac-35"> of the </span>
        <span className="redac-50">Internet</span>
      </h1>
    ),
    body: (
      <>
        <p>
          When we talk about archiving, we talk about <b>timescales</b>. On
          perhaps the longest of timescales, there are stone tablets,
          inscriptions upon which last thousands of years. Paper and vellum rest
          somewhere in between. Treated well, they could last for hundreds.
          Magnetic discs range somewhere between 5 and 20 years of operational
          use, perhaps more if left undisturbed. Journaling enthusiasts may seek
          archival inks, promising material properties less prone to corroding
          or fading over time. What, then, is the timescale of content on the
          Internet?
        </p>
        <p>
          This is, as many questions on the Internet are, somewhat of an open
          question. One study found that, within a ten-year period, a quarter of
          all webpages that existed between some point in the 2013-2023 range
          were inaccessible by the end of 2023. Even worse, for content created
          before or during 2013, this number hiked to 38%.
        </p>
        <p>
          Some sources are even less generous in their assumption, suggesting
          the lifespan of some webpages may be better measured in hours and
          days, not years. Digital places like the Internet Archive stave this
          off through the downloading and hosting of sites in maintained digital
          libraries, hosted on Petabox servers warming an un-air-conditioned
          building out of San Francisco's Richmond District. But even these
          specialized digital repositories are brittle to the follies of
          political upheaval, capital, and corruption. All this together makes
          for an archival medium that is fast-fading, requiring much upkeep, and
          poised to disappear instantly. It may take 5, 10, 20 years for
          magnetic disc errors to build up such that your site becomes
          unreadable in local storage, but it only takes the lights going out in
          the wrong place for the Internet to forget it ever existed.
        </p>
      </>
    ),
  },
  2: {
    heading: (
      <h1>
        <span className="redac-reg">Debrief 2 // </span>
        <span className="redac-20">Link rot,</span>
        <span className="redac-35"> consumption, </span>
        <span className="redac-50">mechanisms of loss</span>
      </h1>
    ),
    body: (
      <>
        <p>
          When we talk about archiving, we talk about <b>access</b>. If a piece
          of media is rendered inaccessible, it is functionally lost to us. In
          some traditions of archiving, this is considered okay, even
          accepted—artifacts are special, immortal things that ought not be
          touched by the untrained human hand. The Web, though, is an
          interconnected medium. It was made to be seen, touched, loved. So, for
          all intents and purposes, we will consider inaccessibility tantamount
          to death. As we've stated, the web divides the internet into nodes
          (pages) and links. Most of the web is not searchably indexable, and
          relies on links to do the heavy lifting of navigation. This is where
          the web is most vulnerable.
        </p>
        <p>
          <b>Link rot</b> is the primary mechanism by which content on the web
          becomes unavailable. It can happen in the frontmatter—a search result
          that leads to nothing, or somewhere you didn't intend—or in the
          intermediary, a homepage that seems to maintain its normal existence
          but whose links to other subpages are all black holes. Worse, two
          pages could each be hosted on perfectly healthy servers but, through a
          chain of broken links, become completely inaccessible. The web, as it
          is, does not support the kind of attribution or backlink awareness to
          solve this, so the dangling website is not an uncommon (non) sight.
        </p>
        <p>
          Even then, what do we truly mean by “rot” and “death”? A page may
          disappear, but as mentioned, its content may exist regardless. Should
          we consider archived pages still rotted, if only because we must
          switch contexts from the page to paste its URL into the Wayback
          Machine? What about domain changes, where content moves? This is where
          the web's hypertextual nature comes out—we care as much about
          relationships as we do content, and a reduction in the quality of our
          understanding of these relationships.
        </p>
        <p>
          So now we have a picture of the mechanisms of death on the Internet;
          pages fail as computers, drives, age. But links fail for a myriad of
          other reasons. Intermediary updates gone awry, relocation without
          propagation, the odd now-and-then forgetting to re-register a domain
          causing a transfer to those strange liminal URL provider sites, all
          manners of death and dying on the web.
        </p>
      </>
    ),
  },
  3: {
    heading: (
      <h1>
        <span className="redac-reg">Debrief 3 // </span>
        <span className="redac-20">Bias & Justice</span>
        <span className="redac-35"> in </span>
        <span className="redac-50">Knowledge Work</span>
      </h1>
    ),
    body: (
      <>
        <p>
          When we talk about archiving, we talk about <b>justice</b>. Whose
          voices have the privilege to be preserved? And with that preservation,
          what sub-narratives cannot be captured?
        </p>
        <p>
          Let's consider, for a moment, NBA 2K16. While an EA Sports yearly
          release may not be the most fascinating case study, there are the
          occasional collectors of sports paraphernalia and specifically
          sporting games who would feel inclined to keep it. Perhaps archive it
          digitally for others, into the future. What one might not see in the
          rearview of this process would be the embedded story of injustice
          therein.
        </p>
        <p>
          Sondra Perry's 2017 work, “It's in the game,” explores the
          exploitation of the likenesses of college basketball athletes used in
          2K without given consent or economic recourse. While a beautiful and
          moving work that reflects the socio-technical landscape of justice in
          our modern age coinciding with the treatment of college athletes, can
          we confidently say these parallel narratives will be preserved? Likely
          not. Because the web thrives on attention, those things that we find
          most engaging, most <i>fun</i>, are what persist. If we are to
          preserve the undercurrents, it takes focused archival attention.
        </p>
        <p>
          Counterculture has always found a place on the Internet, but rarely
          survives as the cultural mind shifts and churns away from the issues
          of today into those of tomorrow. Even in lived reality, justice in
          archival work is a dicey subject, and one complicated by issues of
          ownership and accuracy, but movements are, at the least, solidified by
          their physical lived existence. For Internet archivists into the
          future, the questions remain: how do we recognize salient narratives?
          How do we find underrepresented voices? How do we push back against
          only the survival of that which is made to be engaged with or which
          holds power, whether in capital or attention?
        </p>
      </>
    ),
  },
};

export default function OutroContent({
  completedSetId,
  onContinue,
}: OutroContentProps) {
  const copy = OUTRO_COPY[completedSetId] ?? OUTRO_COPY[3];

  return (
    <div className="inter-content">
      {copy.heading}
      <div className="inter-body">{copy.body}</div>
      <button onClick={onContinue} className="inter-button">
        Continue
      </button>
    </div>
  );
}

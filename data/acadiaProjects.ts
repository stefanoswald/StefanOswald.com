import type { Project } from "@/types/acadia";
import { acadiaGoverningRelatedDocuments } from "@/data/acadiaGoverningDocuments";

const reviewed = "August 10, 2026";

export const acadiaProjects: Project[] = [
  {
    id: "security-cameras",
    title: "Security Cameras",
    status: "Quoted",
    shortDescription:
      "A fourth camera pole is under review alongside lower-cost support and internet options. The installation total remains an estimate, not an approved final cost.",
    fullDescription:
      "The HOA is evaluating a fourth street-camera pole and the ongoing cost of the existing camera system. CSI provided a equipment quote and a separate installation estimate. The board is also comparing the service agreement with pay-as-needed support while preserving secure remote access.",
    estimatedCost:
      "Equipment quote: $13,423 plus sales tax. Boring, installation, and labor: approximately $2,000. Current service agreement: $260 per month; adding the pole would increase it by $145 per month.",
    estimatedTimeline: "Board decision pending contract and cost verification",
    boardNotes:
      "The board should compare the existing contract, recent invoices, actual service-call history, and camera connectivity requirements before choosing a support model.",
    vendorQuoteNotes:
      "Without a service agreement, CSI described a $250 initial service charge plus $95 per additional hour and parts. CSI remote-viewing service was described as $30 per pole, while Spectrum discussed a five-static-IP package around $30 per month, both subject to written confirmation.",
    lastReviewed: reviewed,
    openQuestions: [
      "What does the signed CSI agreement include, and what has the HOA actually paid during the last 12 months?",
      "How many service calls occurred, and which alternative connectivity costs are confirmed in writing?"
    ],
    sourceNotes: [
      {
        title: "CSI fourth-pole proposal",
        sourceType: "Vendor information",
        date: "2026",
        status: "Estimate",
        summary:
          "Supports the $13,423 equipment figure, plus sales tax, and the approximately $2,000 installation allowance."
      },
      {
        title: "Board and vendor correspondence",
        sourceType: "Board record",
        date: "July-August 2026",
        status: "Pending",
        summary:
          "Monthly service and static-IP options were discussed, but the contract, invoices, and service log still need reconciliation."
      }
    ]
  },
  {
    id: "gigapower-fiber",
    title: "GigaPower Fiber",
    status: "Negotiating",
    shortDescription:
      "Legal review found no major red flags, and the board is seeking a shorter contract term before signing the no-cost fiber proposal.",
    fullDescription:
      "The board voted to proceed with GigaPower fiber installation at no cost to the HOA, contingent on legal review. Counsel completed that review and recommended negotiating the proposed 10-year term down to five to seven years. The agreement has not been signed while those terms and project coordination are addressed.",
    estimatedCost: "No HOA installation or maintenance cost is currently proposed",
    estimatedTimeline: "Contract-term negotiation pending",
    boardNotes:
      "The legal contingency has been substantially completed. The remaining decision is whether GigaPower will accept a shorter term and whether the final agreement coordinates adequately with tree, sidewalk, and road work.",
    vendorQuoteNotes:
      "The proposal calls for underground installation and terminals serving pairs of homes. Counsel also noted renewal and early-termination limitations and that abandoned underground infrastructure could remain in place.",
    lastReviewed: reviewed,
    openQuestions: [
      "Will GigaPower accept a five- to seven-year initial term?",
      "Does the final agreement clearly allocate restoration responsibility and construction coordination?"
    ],
    sourceNotes: [
      {
        title: "May 28 board vote",
        sourceType: "Board record",
        date: "May 28, 2026",
        status: "Verified",
        summary: "The board voted to proceed at no HOA cost, contingent on attorney review."
      },
      {
        title: "HOA counsel contract review",
        sourceType: "Professional assessment",
        date: "July 21, 2026",
        status: "Verified",
        summary:
          "Counsel reported no major red flags and recommended negotiating the proposed 10-year term to five to seven years."
      }
    ]
  },
  {
    id: "landscaping-tree-removal-replacement",
    title: "Trees and Landscape Renewal",
    status: "Quoted",
    shortDescription:
      "The latest arborist review favors preserving the four previously questioned trees through targeted root work, growth regulation, and careful pruning.",
    fullDescription:
      "The HOA is comparing tree preservation, sidewalk-root mitigation, pruning, sod, shrubs, and broader landscape renewal. Urban Tree Doctor evaluated 37 oak trees and did not recommend removing the four trees previously identified for possible removal. Its current approach uses targeted root pruning and barriers, tree-growth regulation, and pruning appropriate to each tree.",
    estimatedCost:
      "Most growth-regulator treatments are listed at $240 per tree. Four root-pruning and barrier locations are approximately $2,000 each. A broader Action Environmental landscape estimate totaled $136,081.05 but expired in July 2026.",
    estimatedTimeline: "Final preservation scope and comparable current proposals pending",
    boardNotes:
      "The later independent assessment supersedes the June assumption that four trees could not be preserved. Tree, sidewalk, irrigation, and landscape decisions should be presented as one coordinated sequence.",
    vendorQuoteNotes:
      "Urban Tree Doctor recommends end-weight reduction rather than interior thinning for magnolias and describes tree-growth regulation as a recurring treatment, generally around every three years. Final pruning percentages, treatment timing, and recurring costs remain open.",
    lastReviewed: reviewed,
    openQuestions: [
      "What is the final tree-by-tree scope, including pruning method, treatment timing, and recurring cost?",
      "Which landscape items remain priorities after tree and sidewalk work, and which proposals must be refreshed?"
    ],
    sourceNotes: [
      {
        title: "Urban Tree Doctor assessment",
        sourceType: "Professional assessment",
        date: "July-August 2026",
        status: "Verified",
        summary:
          "Supports preservation of the four questioned trees using targeted root work, barriers, growth regulation, and monitored pruning."
      },
      {
        title: "Action Environmental landscape estimate",
        sourceType: "Vendor information",
        date: "June 16, 2026",
        status: "Historical",
        summary:
          "The $136,081.05 proposal is useful for scope comparison but its 30-day validity period has expired."
      }
    ],
    communityFeedback: [
      {
        text:
          "Neighbors want the board to compare one accountable landscape provider with the current arrangement, including tree care and irrigation responsibilities.",
        source: "Facebook community discussion",
        date: "August 2026"
      },
      {
        text:
          "Several residents favor a preservation-first approach when it can address sidewalk safety without removing healthy trees.",
        source: "Homeowner correspondence",
        date: "July-August 2026"
      }
    ]
  },
  {
    id: "road-assessment",
    title: "Road Assessment",
    status: "Quoted",
    shortDescription:
      "Contractors have outlined short-term repair and seal-coat work versus longer-term milling and paving, but the underlying prices still need reconciliation.",
    fullDescription:
      "The roads were last sealed in 2023. Contractors have described targeted repairs and seal coating as a shorter-term maintenance option and one-inch milling with a 1.25-inch asphalt overlay as the stronger long-term option. Road work should follow decisions that may disturb pavement, including roots, sidewalks, and utilities.",
    estimatedCost:
      "Prior related work totaled $15,737.60. Planning discussions reference approximately $12,000 for repairs and seal coating and roughly $80,000 to $90,000 for future resurfacing, but the supporting current proposals must be verified before approval.",
    estimatedTimeline: "After tree, sidewalk, and utility scopes are settled",
    boardNotes:
      "No road option should be presented as approved until comparable scopes, quote dates, and source proposals are attached.",
    vendorQuoteNotes:
      "One contractor estimated milling and paving could last 15 to 20 years and a one-inch overlay 5 to 10 years, with reflection-crack risk. Those are vendor estimates rather than warranties.",
    lastReviewed: reviewed,
    openQuestions: [
      "Which current signed proposals support the short-term and full-resurfacing figures?",
      "What work must occur first to avoid cutting a newly repaired road?"
    ],
    sourceNotes: [
      {
        title: "Road contractor correspondence",
        sourceType: "Vendor information",
        date: "2026",
        status: "Estimate",
        summary:
          "Describes the expected life and tradeoffs of repair, seal coating, overlay, and milling options; final comparable proposals remain pending."
      }
    ]
  },
  {
    id: "sidewalk-repair",
    title: "Sidewalk Repair",
    status: "Quoted",
    shortDescription:
      "Seventeen sidewalk areas, two driveway aprons, and a small curb section have been identified, with work sequenced after tree-root decisions.",
    fullDescription:
      "The current sidewalk scope identifies 17 sidewalk locations, two driveway-apron areas, and approximately six feet of curb. The anticipated sequence is removal of damaged concrete, arborist-directed root work and barriers, then installation of replacement concrete.",
    estimatedCost:
      "A planning comparison cites $28,621.55 for sidewalk work and approximately $2,500 for roots handled during concrete work. The board should attach and confirm the current proposal before approval.",
    estimatedTimeline: "After final tree and root-mitigation scope",
    boardNotes:
      "Tree and sidewalk work should be approved as a coordinated sequence so root mitigation is completed before replacement concrete is installed.",
    vendorQuoteNotes: "Two sidewalk proposals were reported received; final scope comparison remains pending.",
    lastReviewed: reviewed,
    openQuestions: [
      "Which proposal supports the $28,621.55 figure, and is it still valid?",
      "Are root barriers, driveway aprons, curb work, restoration, and permits included?"
    ],
    sourceNotes: [
      {
        title: "Sidewalk planning scope",
        sourceType: "Vendor information",
        date: "2026",
        status: "Estimate",
        summary:
          "Identifies the repair locations and sequencing, while the final current quote and inclusions remain to be confirmed."
      }
    ]
  },
  {
    id: "pest-control",
    title: "Pest Control",
    status: "In Progress",
    shortDescription:
      "Thirty bait boxes remain in service because activity was observed. Two broader residential proposals conflict, so neither is treated as final.",
    fullDescription:
      "Rodent and fly-control work remains active. Action Environmental reported ongoing bait consumption and said the 30 bait boxes were still necessary. A broader program covering individual homes was also proposed, but two versions contain different per-home and startup prices.",
    estimatedCost:
      "Current common-area services were described as $240 per month for rodent control and $295 per month for fly control. Broader residential proposals conflict: one lists $35 per home and a $4,000 startup; another lists $42 per home and a $4,448 startup.",
    estimatedTimeline: "Common-area service ongoing; residential expansion not approved",
    boardNotes:
      "The board should identify the final proposal before considering residential service and obtain homeowner consent before sharing any resident contact information with a vendor.",
    vendorQuoteNotes:
      "Because the June 25 and June 29 versions conflict, neither broader monthly total is presented as current or approved.",
    lastReviewed: reviewed,
    openQuestions: [
      "Which proposal is the vendor's final offer, and what exact services, term, and cancellation provisions apply?",
      "Would participation be mandatory or optional, and how would homeowner privacy and scheduling be handled?"
    ],
    sourceNotes: [
      {
        title: "May 28 meeting minutes",
        sourceType: "Board record",
        date: "May 28, 2026",
        status: "Verified",
        summary: "Records active rodent activity and the recommendation to retain 30 bait boxes."
      },
      {
        title: "Action Environmental residential proposals",
        sourceType: "Vendor information",
        date: "June 25 and June 29, 2026",
        status: "Pending",
        summary: "The two versions contain different per-home, startup, and combined monthly figures."
      }
    ]
  },
  {
    id: "fence-replacement",
    title: "Fence Replacement",
    status: "Proposed",
    shortDescription:
      "A future white-PVC replacement has been discussed at roughly $22,000, but ownership, survey evidence, insurance treatment, and a current quote remain unresolved.",
    fullDescription:
      "The HOA is monitoring deterioration of the perimeter chain-link fence and vegetation encroachment from the neighboring property. White PVC has been discussed as a future replacement, but the project should not proceed until ownership is documented and a current comparable scope is obtained.",
    estimatedCost: "Approximately $22,000 appears in planning material; no verified current quote is attached",
    estimatedTimeline: "Timing not established",
    boardNotes:
      "Correspondence conflicts on whether existing survey markers establish HOA ownership. Insurance coverage for deterioration, vegetation, or storm damage is also unconfirmed.",
    vendorQuoteNotes: "The planning allowance is not a current accepted proposal.",
    lastReviewed: reviewed,
    openQuestions: [
      "What recorded survey or title evidence establishes ownership and responsibility?",
      "What current quote and written insurance determination apply to the actual scope?"
    ],
    sourceNotes: [
      {
        title: "Board planning correspondence",
        sourceType: "Board record",
        date: "July-August 2026",
        status: "Pending",
        summary:
          "Supports the general condition concern and approximate planning allowance, but contains unresolved ownership and insurance questions."
      }
    ]
  },
  {
    id: "insurance-review",
    title: "Insurance Review",
    status: "Researching",
    shortDescription:
      "The board is clarifying property schedules and coverage limits. The figures under review are not cash savings or funds available for projects.",
    fullDescription:
      "The board is reviewing the HOA's property, liability, crime, and directors-and-officers coverage. A $5,000 unscheduled-maintenance-property limit was described as equipment originally kept in a shed, while a $6,100 irrigation limit remained underwriter review. Coverage limits cannot be treated as money that can be redirected to projects.",
    estimatedCost:
      "Reported annual premiums: property $1,316.50, liability $442.65, crime $419, and directors and officers $1,710.59. No confirmed premium savings are currently published.",
    estimatedTimeline: "Pending carrier and broker clarification",
    boardNotes:
      "Any change should be based on updated declarations or a written endorsement showing covered property, replacement values, premium effect, and ownership responsibility.",
    vendorQuoteNotes:
      "The broker confirmed the origin of the $5,000 scheduled item. Irrigation treatment was still being clarified with the underwriter, so it should not be described as unnecessary coverage.",
    lastReviewed: reviewed,
    openQuestions: [
      "What property is listed on the final current declarations and at what replacement values?",
      "What premium change, if any, would result from a carrier-approved endorsement?"
    ],
    sourceNotes: [
      {
        title: "Insurance broker correspondence",
        sourceType: "Vendor information",
        date: "July-August 2026",
        status: "Pending",
        summary:
          "Clarifies some scheduled-property history but does not establish $11,000 in savings or fully resolve irrigation coverage."
      }
    ]
  },
  {
    id: "gate-code-update",
    title: "Gate Access Update",
    status: "Complete",
    shortDescription:
      "The homeowner gate-code transition was completed August 1. The active credential is intentionally not published on this public website.",
    fullDescription:
      "The scheduled homeowner gate-access update was completed on August 1, 2026. For community security, current and former access credentials are distributed through private HOA communications rather than posted publicly.",
    estimatedCost: "No material ongoing project cost reported",
    estimatedTimeline: "Completed August 1, 2026",
    boardNotes:
      "Residents who need the current credential should use the HOA's established private contact channel.",
    vendorQuoteNotes: "No further vendor work is currently reported.",
    lastReviewed: reviewed,
    sourceNotes: [
      {
        title: "Gate-access transition record",
        sourceType: "Board record",
        date: "August 1, 2026",
        status: "Verified",
        summary: "Confirms completion without exposing the credential publicly."
      }
    ]
  },
  {
    id: "bylaw-review",
    title: "Governing Document Review",
    status: "Researching",
    shortDescription:
      "The board is reviewing bylaws, covenants, tree requirements, design standards, and the relationship between community and master documents.",
    fullDescription:
      "The board is reviewing older governing documents and gathering questions that may warrant a clearer Rules and Regulations document. Draft interpretations and homeowner suggestions are research inputs, not adopted rules, until they receive the required board and legal review.",
    estimatedCost: "Attorney and document-preparation costs to be determined",
    estimatedTimeline: "Research and clarification questions in progress",
    boardNotes:
      "Document hierarchy and enforcement language should be reviewed by HOA counsel before the website describes a disputed interpretation as binding.",
    vendorQuoteNotes: "No attorney engagement or final drafting quote is attached.",
    relatedDocuments: acadiaGoverningRelatedDocuments,
    lastReviewed: reviewed,
    openQuestions: [
      "Which practical homeowner questions are not answered clearly by the existing governing documents?",
      "What adoption, notice, and legal-review process is required for a clarifying Rules and Regulations document?"
    ],
    sourceNotes: [
      {
        title: "Acadia governing document library",
        sourceType: "Board record",
        date: "Various recording dates",
        status: "Verified",
        summary:
          "The recorded declarations, amendments, articles, bylaws, plat, and master documents are available for direct review."
      },
      {
        title: "Draft interpretation correspondence",
        sourceType: "Board record",
        date: "2026",
        status: "Pending",
        summary: "Working interpretations remain subject to manager and attorney confirmation."
      }
    ]
  },
  {
    id: "community-website",
    title: "Community Website",
    status: "Complete",
    shortDescription:
      "The public project website, source-grounded document assistant, and informal homeowner feedback tools are live and will continue to be maintained.",
    fullDescription:
      "The Acadia website is live with project updates, source status, public documents, informal homeowner feedback, and answers grounded in the governing documents. Project voting is being moved to a shared database so totals persist across devices while house numbers remain private.",
    estimatedCost: "Initial build completed; hosting, database, and AI usage may vary",
    estimatedTimeline: "Live, with ongoing maintenance",
    boardNotes:
      "The site separates verified records, estimates, pending questions, and anonymized community feedback. It does not replace official notices, board meetings, legal advice, or legally binding elections.",
    vendorQuoteNotes: "No outside website vendor was required.",
    lastReviewed: reviewed,
    sourceNotes: [
      {
        title: "Live Acadia website",
        sourceType: "Board record",
        date: "2026",
        status: "Verified",
        summary: "The project page and governing-document assistant are publicly available."
      }
    ]
  },
  {
    id: "community-signage-and-appearance",
    title: "Community Signage and Appearance",
    status: "Proposed",
    shortDescription:
      "Neighbors have raised damaged gate-area signage, bent or leaning parking signs, and street-light appearance as visible maintenance priorities.",
    fullDescription:
      "Several smaller common-area items have been raised for review, including damaged gate-area signage, aging parking signs, and street-light pole appearance. These can be evaluated as a coordinated maintenance list with clear responsibility and current pricing.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Pending responsibility review and current options",
    boardNotes:
      "These requests are documented community priorities, but no replacement package or budget has been approved.",
    vendorQuoteNotes: "The prior sign vendor is reportedly no longer available; alternatives are needed.",
    lastReviewed: reviewed,
    openQuestions: [
      "Which items are HOA, utility, or vendor responsibilities?",
      "Can volunteer help be used safely, or should the work be professionally contracted?"
    ],
    sourceNotes: [
      {
        title: "Community maintenance discussion",
        sourceType: "Community feedback",
        date: "August 2026",
        status: "Verified",
        summary: "Confirms that multiple residents raised the visible maintenance concerns."
      }
    ],
    communityFeedback: [
      {
        text:
          "Residents specifically called attention to damaged no-parking and gate-area signs and asked whether volunteers could help with smaller appearance projects.",
        source: "Facebook community discussion",
        date: "August 2026"
      }
    ]
  },
  {
    id: "irrigation-repair-monitoring",
    title: "Irrigation Repair and Monitoring",
    status: "Quoted",
    shortDescription:
      "A $465 repair estimate attributes one outage to damaged control wire, while a field observation suggests a closed valve may be involved.",
    fullDescription:
      "The HOA received a GreenRock estimate for an irrigation outage. The estimate identifies approximately 125 feet of damaged control wire; a later field observation raised a different possible cause involving a valve. The diagnosis should be reconciled before approval.",
    estimatedCost: "$465 repair estimate",
    estimatedTimeline: "Diagnosis and approval pending",
    boardNotes:
      "The board also needs a repeatable process for determining whether future outages originate in HOA equipment or homeowner-controlled components without publishing house-specific details.",
    vendorQuoteNotes: "Estimate 2312 should not be approved until the conflicting field observation is resolved.",
    lastReviewed: reviewed,
    openQuestions: [
      "What test confirms the actual cause of the outage?",
      "Who owns and controls each relevant component under the governing documents and property layout?"
    ],
    sourceNotes: [
      {
        title: "GreenRock Estimate 2312",
        sourceType: "Vendor information",
        date: "August 5, 2026",
        status: "Estimate",
        summary: "Quotes $465 to address damaged irrigation control wire."
      },
      {
        title: "Follow-up field observation",
        sourceType: "Board record",
        date: "August 2026",
        status: "Pending",
        summary: "Identifies a possible valve issue that should be reconciled before work is approved."
      }
    ]
  },
  {
    id: "landscaping-contract-review",
    title: "Landscaping Contract Review",
    status: "Quoted",
    shortDescription:
      "The board is comparing the existing arrangement with proposals reported at $4,250 and $3,700 per month, with service scopes still needing normalization.",
    fullDescription:
      "The board is reviewing landscaping, tree-trimming, fertilizer, weed-control, and irrigation responsibilities across current and prospective providers. A fair decision requires a side-by-side scope that distinguishes routine maintenance from separate tree and irrigation work.",
    estimatedCost:
      "Planning correspondence reports one alternative at $4,250 per month and an Action Environmental proposal at $3,700 per month. The Action proposal was dated June 16, 2026; current pricing and terms should be refreshed.",
    estimatedTimeline: "Comparable current scopes and board decision pending",
    boardNotes:
      "Vendor performance claims from community discussion should be treated as feedback unless supported by contracts, work orders, and documented service history.",
    vendorQuoteNotes:
      "The Action proposal was described as $3,350 per month for weekly service plus $350 for fertilizer and weed control. A fresh incumbent proposal was not identified in the reviewed record.",
    lastReviewed: reviewed,
    openQuestions: [
      "What exact services, exclusions, visit frequency, licensing, insurance, and termination terms apply to each proposal?",
      "What documented performance measures will the board use after selection?"
    ],
    sourceNotes: [
      {
        title: "Action Environmental maintenance proposal",
        sourceType: "Vendor information",
        date: "June 16, 2026",
        status: "Historical",
        summary: "Lists $3,700 per month and needs pricing and term confirmation before reliance."
      },
      {
        title: "Community vendor discussion",
        sourceType: "Community feedback",
        date: "August 2026",
        status: "Pending",
        summary: "Shows strong interest in accountability and comparison, but individual performance claims are not independently verified."
      }
    ],
    communityFeedback: [
      {
        text:
          "Neighbors asked for a clear, apples-to-apples comparison and one point of accountability for landscaping, tree care, and irrigation.",
        source: "Facebook community discussion",
        date: "August 2026"
      }
    ]
  },
  {
    id: "pool-privacy-screening-standards",
    title: "Pool Privacy Screening Standards",
    status: "Proposed",
    shortDescription:
      "The board is considering consistent privacy-screening options for pool enclosures visible from community roads. No standard has been adopted.",
    fullDescription:
      "Pool-enclosure screening has raised questions about privacy, appearance, and architectural approval. The next step is to identify practical options and evaluate them consistently under existing design-review authority before proposing any new standard.",
    estimatedCost: "Homeowner cost depends on any future approved standard",
    estimatedTimeline: "Board and homeowner discussion pending",
    boardNotes:
      "No individual property or homeowner should be identified publicly while the board evaluates a community-wide standard.",
    vendorQuoteNotes:
      "A screen-repair provider was recommended in the Facebook group, but an active LLC does not by itself verify contractor licensing, insurance, or a current rate.",
    lastReviewed: reviewed,
    openQuestions: [
      "Which materials and placement options are allowed under the current documents?",
      "Would a new standard require legal review, formal notice, or architectural guidelines?"
    ],
    sourceNotes: [
      {
        title: "Community screening discussion",
        sourceType: "Community feedback",
        date: "August 2026",
        status: "Pending",
        summary: "Identifies the desire for privacy and consistent appearance; no adopted rule or endorsed vendor resulted."
      }
    ]
  },
  {
    id: "street-light-refurbishment",
    title: "Street Light Cleaning and Repainting",
    status: "Researching",
    shortDescription:
      "Duke Energy evaluated the request to clean or repaint street-light poles. The available options, responsibility, and cost still need to be documented.",
    fullDescription:
      "A work order was opened with Duke Energy after residents raised the appearance of community street-light poles. The evaluation was reported complete, but the resulting options and responsibility determination were not included in the reviewed record.",
    estimatedCost: "Awaiting Duke Energy options",
    estimatedTimeline: "Update pending",
    boardNotes: "The board should publish Duke's written response when available.",
    vendorQuoteNotes: "No written cost or work option is attached yet.",
    lastReviewed: reviewed,
    openQuestions: ["What did Duke Energy authorize, recommend, or price after its evaluation?"],
    sourceNotes: [
      {
        title: "Duke Energy work-order update",
        sourceType: "Vendor information",
        date: "August 2026",
        status: "Pending",
        summary: "The evaluation was reported complete, but its written outcome is not yet available here."
      }
    ],
    communityFeedback: [
      {
        text: "Residents asked whether aging street-light poles could be cleaned or repainted.",
        source: "Facebook community discussion",
        date: "August 2026"
      }
    ]
  },
  {
    id: "assessment-enforcement-policy",
    title: "Assessment Collection and Enforcement",
    status: "Proposed",
    shortDescription:
      "Consistent late-fee and interest enforcement was scheduled for discussion, but the reviewed record does not establish that a policy was adopted.",
    fullDescription:
      "The board planned to discuss applying the governing documents consistently to assessments not paid on time, potentially beginning with the January 1, 2027 due date. Until approved minutes or a formal resolution confirm action, this remains a proposal.",
    estimatedCost: "Administrative, legal, and collection costs to be determined",
    estimatedTimeline: "Proposed effective date was January 1, 2027; adoption not confirmed",
    boardNotes:
      "Any final process should identify the governing authority, amounts, due dates, notices, hearing rights where applicable, and collection steps without publishing any owner's account information.",
    vendorQuoteNotes: "No outside collection or legal proposal is attached.",
    lastReviewed: reviewed,
    openQuestions: [
      "Did the board adopt a formal policy, and where is the approved resolution or meeting record?",
      "Has HOA counsel confirmed the notice and collection procedure?"
    ],
    sourceNotes: [
      {
        title: "August 13 agenda item",
        sourceType: "Board record",
        date: "August 13, 2026",
        status: "Pending",
        summary: "Shows that a vote was proposed, not that the policy was adopted."
      }
    ]
  }
];

export function getAcadiaProject(projectId: string) {
  return acadiaProjects.find((project) => project.id === projectId);
}

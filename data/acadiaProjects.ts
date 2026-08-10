import type { Project } from "@/types/acadia";
import { acadiaGoverningRelatedDocuments } from "@/data/acadiaGoverningDocuments";

const juneProjectUpdate = {
  title: "June 25, 2026 Project Update",
  href: "/acadia-documents/june-25-2026-project-update.docx",
  fileType: "DOCX" as const
};

const actionTreeOpinion = {
  title: "Action Environmental Tree Opinion",
  href: "/acadia-documents/ace-tree-opinion.docx",
  fileType: "DOCX" as const
};

const landscapeEstimate = {
  title: "Action Environmental Landscape Estimate",
  href: "/acadia-documents/aec-landscape-estimate-all-acadia.pdf",
  fileType: "PDF" as const
};

const augustMeetingAgenda = {
  title: "August 13, 2026 HOA Meeting Agenda",
  href: "/acadia-documents/august-13-2026-meeting-agenda.docx",
  fileType: "DOCX" as const
};

const communityReminders = {
  title: "Acadia Estates Homeowner Reminders",
  href: "/acadia-documents/acadia-estates-community-reminders.docx",
  fileType: "DOCX" as const
};

const urbanTreeDoctorScope = {
  title: "Urban Tree Doctor Assessment and Scope of Work",
  href: "/acadia-documents/urban-tree-doctor-scope-of-work.pdf",
  fileType: "PDF" as const
};

const greenrockIrrigationEstimate = {
  title: "GreenRock Irrigation Repair Estimate 2312",
  href: "/acadia-documents/greenrock-irrigation-estimate-2312.pdf",
  fileType: "PDF" as const
};

export const acadiaProjects: Project[] = [
  {
    id: "security-cameras",
    title: "Security Cameras",
    status: "Quoted",
    shortDescription:
      "A fourth camera pole is estimated at $15,423 upfront. The board is also comparing the current service agreement with lower-cost support and internet options.",
    fullDescription:
      "The HOA is reviewing expanded street-camera coverage and the ongoing cost of the existing system. CSI estimated that a fourth pole would require a new pole and camera, boring and installation, and an upgrade from an 8-channel to a 16-channel NVR. The board is also evaluating whether to keep the full service agreement or pay for service only when needed while maintaining remote access.",
    estimatedCost:
      "Fourth pole: approximately $15,423 upfront. Current service agreement: $260/month. With a fourth pole: $405/month. Service without the agreement starts at $250 for the first 30 minutes plus $95/hour and parts.",
    estimatedTimeline: "Board discussion and possible vote scheduled for August 13, 2026",
    boardNotes:
      "Board members already have access to live and recorded video. The board is reviewing past service-call history, camera bandwidth needs, and whether a lower-cost Spectrum plan and static IP service could support the system.",
    vendorQuoteNotes:
      "CSI quoted $13,423 for the pole and camera plus approximately $2,000 for boring, installation, and labor. The additional pole would add $145 per month to the service agreement. Spectrum estimated five static IP addresses at about $30 per month, subject to account verification.",
    relatedDocuments: [juneProjectUpdate, augustMeetingAgenda]
  },
  {
    id: "gigapower-fiber",
    title: "GigaPower Fiber",
    status: "Attorney Review",
    shortDescription:
      "Board voted to proceed with GigaPower fiber optic installation throughout the community at no cost to the HOA, contingent on HOA attorney review. Signing is paused until the tree, sidewalk, and road project scope is better understood.",
    fullDescription:
      "The board has voted to move forward with GigaPower fiber optic installation throughout Acadia Estates at no cost to the HOA, subject to attorney review. Signing is currently paused so the board can better understand how this project may interact with tree, sidewalk, and road work.",
    estimatedCost: "No cost to HOA currently proposed",
    estimatedTimeline: "Paused pending attorney review and project coordination",
    boardNotes:
      "The board wants legal review and better clarity on overlapping infrastructure work before signing.",
    vendorQuoteNotes:
      "GigaPower proposal indicates installation throughout the community at no HOA cost, subject to final review.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "landscaping-tree-removal-replacement",
    title: "Landscaping / Tree Removal and Replacement",
    status: "Quoted",
    shortDescription:
      "Urban Tree Doctor supports a long-term preservation plan using targeted root barriers, growth regulation, and careful pruning. Follow-up pricing and treatment details are still being gathered.",
    fullDescription:
      "The HOA is comparing tree preservation against full removal and replacement, along with broader landscaping, sod, shrub, and irrigation needs. Urban Tree Doctor evaluated 37 oak trees and confirmed magnolias in front of most homes. The arborist advised that targeted root barriers and tree-growth regulation can reduce future sidewalk risk and provide a long-term preservation approach, with treatment generally repeated every three years.",
    estimatedCost:
      "Tree preservation proposal: $16,653.50. Tree removal proposals currently range from approximately $66,000 to $120,000. Broader landscape estimate: $136,081.05.",
    estimatedTimeline: "Additional proposals and arborist input being gathered",
    boardNotes:
      "The latest arborist review does not recommend removing four trees previously identified for possible removal. The board is seeking final answers on canopy-pruning timing, magnolia care, lawn viability, recurring treatment costs, and governing-document authority before selecting a scope.",
    vendorQuoteNotes:
      "Urban Tree Doctor recommends end-weight reduction rather than interior thinning for magnolias, says treated oaks have a high likelihood of survival, and lists $240 growth-regulator treatments for most public trees plus approximately $2,000 root-pruning and barrier work at four locations. Canopy-pruning pricing is still being requested.",
    relatedDocuments: [
      juneProjectUpdate,
      actionTreeOpinion,
      landscapeEstimate,
      urbanTreeDoctorScope,
      augustMeetingAgenda
    ]
  },
  {
    id: "road-assessment",
    title: "Road Assessment",
    status: "Quoted",
    shortDescription:
      "A contractor recommends targeted repairs and seal coating to extend the roads for several years, while full milling and paving remains the best long-term option.",
    fullDescription:
      "The community roads were last sealed about three and a half years ago, with prior related costs totaling $15,737.60. Florida Sealcoating advised that targeted repairs followed by seal coating could maintain the property for several more years. Its longer-term option would mill one inch of existing asphalt and install a 1.25-inch overlay. Road work must be coordinated with tree, sidewalk, and utility decisions.",
    estimatedCost: "Prior related costs totaled $15,737.60; current resurfacing cost TBD",
    estimatedTimeline: "After tree/root work and sidewalk scope are finalized",
    boardNotes:
      "Road scope should be coordinated with any tree, sidewalk, or utility work that may affect pavement.",
    vendorQuoteNotes:
      "Florida Sealcoating recommends completing arborist-directed trimming and root work before concrete and asphalt repairs. Final pricing and scope comparison remain under review.",
    relatedDocuments: [juneProjectUpdate, augustMeetingAgenda]
  },
  {
    id: "sidewalk-repair",
    title: "Sidewalk Repair",
    status: "Quoted",
    shortDescription:
      "A contractor identified 17 sidewalk locations, two driveway-apron areas, and about six feet of curb for repair after tree and root work is completed.",
    fullDescription:
      "The HOA has received sidewalk proposals, and Florida Sealcoating recommends repairs at 17 sidewalk locations, two driveway-apron areas, and approximately six feet of curb. The board is deferring final action until tree preservation, root mitigation, and possible tree removal questions are resolved because that work affects concrete scope and timing.",
    estimatedCost: "Two concrete sidewalk proposals received; final cost TBD",
    estimatedTimeline:
      "Expected sequence is damaged sidewalk removal, tree/root work, then new sidewalk installation",
    boardNotes:
      "Tree and sidewalk decisions are linked. The board expects damaged concrete removal, arborist-directed root work and barriers, then replacement concrete. A possible vote is scheduled for August 13 if the scope and costs are clear enough.",
    vendorQuoteNotes:
      "Two concrete sidewalk proposals have been received. Florida Sealcoating supplied the latest repair-location recommendation, but final pricing is still being compared.",
    relatedDocuments: [
      juneProjectUpdate,
      actionTreeOpinion,
      urbanTreeDoctorScope,
      augustMeetingAgenda
    ]
  },
  {
    id: "pest-control",
    title: "Pest Control",
    status: "In Progress",
    shortDescription:
      "Action Environmental confirmed ongoing rodent and fly-control needs and also proposed a community-wide residential pest control program.",
    fullDescription:
      "Pest control work is active. Action Environmental confirmed that 30 rodent bait boxes remain necessary because rodent activity is still present. Trash cans were sprayed on June 4 and fresh bait was added after activity was found. Action Environmental has also proposed an optional community-wide residential pest control program for all 32 properties.",
    estimatedCost:
      "Rodent control: $240/month. Fly control: $295/month. Proposed residential pest control: $1,344/month plus $4,448 total initial startup cost for all participating properties.",
    estimatedTimeline: "Active and ongoing",
    boardNotes:
      "The current bait box count remains necessary based on confirmed activity. The board can consider whether a broader community-wide residential pest program is worth pursuing.",
    vendorQuoteNotes:
      "Action Environmental proposed $42/month per property for quarterly residential pest control, with discounted one-time initial interior service of $139 per property. If residential pest control, rodent control, and fly control are all continued, the total monthly investment would be $1,879/month."
  },
  {
    id: "fence-replacement",
    title: "Fence Replacement",
    status: "Proposed",
    shortDescription:
      "Chain link fence deterioration and vegetation encroachment from Oak Island Harbor are being monitored. Survey markers are in place, but timing is not established.",
    fullDescription:
      "The HOA is monitoring chain link fence deterioration and vegetation encroachment from Oak Island Harbor. Replacement with white PVC fencing is being considered for the future, survey markers are in place, and the board is holding on proceeding while funds are built and competing projects are prioritized.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Timing not established",
    boardNotes:
      "The board is monitoring deterioration and encroachment before deciding replacement scope. This remains a future priority, but other infrastructure needs may come first.",
    vendorQuoteNotes: "No current vendor or quote notes are available.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "insurance-review",
    title: "Insurance Review",
    status: "Researching",
    shortDescription:
      "The board is reviewing current policies and may redirect $11,000 of no-longer-applicable coverage toward replacement protection for community walls and the gate.",
    fullDescription:
      "The board is reviewing current insurance coverage. The annual liability premium is $442.65, paid yearly in January. A possible change would redirect $11,000 of coverage that is no longer applicable toward replacement-cost protection for the perimeter brick wall, entrance wall, and gate.",
    estimatedCost:
      "Current annual liability premium is $442.65; $11,000 of existing coverage is under review for reallocation",
    estimatedTimeline: "Possible board vote scheduled for August 13, 2026",
    boardNotes:
      "Policies have been gathered for review and possible shopping. Any coverage change remains subject to board approval and insurer confirmation.",
    vendorQuoteNotes: "No alternate carrier quote has been selected yet.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "gate-code-update",
    title: "Gate Code Update",
    status: "Complete",
    shortDescription:
      "New gate code 4052 is in effect. Old code 1981 expired August 1, 2026, and the emergency responder and utilities code remains unchanged.",
    fullDescription:
      "The gate code update is complete. The new gate code is 4052, and the old code 1981 expired August 1, 2026. The emergency responder and utilities code remains unchanged.",
    estimatedCost: "Minimal signage or communication cost expected",
    estimatedTimeline: "Completed August 1, 2026",
    boardNotes:
      "The new homeowner code is active and the transition period for the old code has ended.",
    vendorQuoteNotes: "No further vendor work is currently required.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "bylaw-review",
    title: "Bylaw Review",
    status: "Researching",
    shortDescription:
      "The board is reviewing outdated bylaws, tree requirements, design standards, covenants, and master agreement documents, and initial homeowner suggestions have been received.",
    fullDescription:
      "The board is reviewing governing documents that may need updates, including outdated bylaws, tree requirements, design standards, covenants, and master agreement documents. Documents are available through the AMG Enumerate portal, though not all documents may be uploaded yet.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Proposed for review",
    boardNotes:
      "The HOA requested volunteers to review bylaws, covenants, and the master agreement. Initial notes and homeowner suggestions for possible CC&R changes have now been received.",
    vendorQuoteNotes: "No vendor or attorney quote notes are available yet.",
    relatedDocuments: [
      communityReminders,
      augustMeetingAgenda,
      ...acadiaGoverningRelatedDocuments
    ]
  },
  {
    id: "community-website",
    title: "Community Website",
    status: "Complete",
    shortDescription:
      "The Acadia community website is live with project updates, informal homeowner voting, related documents, and a governing-document assistant.",
    fullDescription:
      "The public-facing Acadia website has launched to share HOA project updates, related documents, informal homeowner voting, and answers grounded in the community's governing documents.",
    estimatedCost: "Initial website completed; ongoing hosting and AI usage may vary",
    estimatedTimeline: "Complete and live",
    boardNotes:
      "Votes remain informal feedback and are not a legally binding election system. Project information and documents will continue to be maintained as board work progresses.",
    vendorQuoteNotes: "No outside website vendor was required.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "community-signage-and-appearance",
    title: "Community Signage and Appearance Items",
    status: "Proposed",
    shortDescription:
      "Several smaller common-area appearance items were raised, including damaged gate signage and bent or leaning no-parking signs.",
    fullDescription:
      "Several smaller community appearance items were raised for attention. These include replacing or removing the damaged exit-gate sign, replacing damaged parking signs with more durable options, and improving visible common-area conditions that affect the streetscape.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Proposed for future agenda discussion",
    boardNotes:
      "These items are smaller than the major infrastructure projects but may still improve the appearance and consistency of the community.",
    vendorQuoteNotes:
      "The prior sign vendor is no longer in business, so the board needs replacement options or a volunteer approach for smaller sign repairs.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "irrigation-repair-monitoring",
    title: "Irrigation Repair and Monitoring",
    status: "Quoted",
    shortDescription:
      "A $465 repair estimate was received for an irrigation outage, and the board is clarifying how outages should be diagnosed and handled.",
    fullDescription:
      "The HOA received a $465 GreenRock estimate for an irrigation problem affecting one part of the community. The estimate attributes the outage to a broken wire, while a later field note raised the possibility of a closed homeowner irrigation valve. The cause should be confirmed before the repair is finalized, and the board is also reviewing the process for future irrigation outages.",
    estimatedCost: "$465 current repair estimate",
    estimatedTimeline: "Diagnosis and approval pending",
    boardNotes:
      "Working irrigation is necessary for HOA-maintained landscaping. The board wants a clear process for determining whether an outage is in HOA equipment or homeowner-controlled equipment.",
    vendorQuoteNotes:
      "GreenRock Landscapes issued Estimate 2312 for $465. The exact cause should be reconciled with the later field observation before approval.",
    relatedDocuments: [greenrockIrrigationEstimate, augustMeetingAgenda]
  },
  {
    id: "landscaping-contract-review",
    title: "Landscaping Company Contract Review",
    status: "Researching",
    shortDescription:
      "The board is reviewing GreenRock's landscaping, tree-trimming, and irrigation services and considering alternative companies.",
    fullDescription:
      "The board is evaluating the community's landscaping contract after concerns about the services provided by GreenRock over several years. Before any change, the board wants a side-by-side comparison of service scope, performance, and financial impact from qualified alternatives.",
    estimatedCost: "To be determined through contract comparison",
    estimatedTimeline: "Comparison under review; vote possible when adequate information is available",
    boardNotes:
      "Any vendor change should compare like-for-like landscaping, tree-trimming, and irrigation responsibilities so service levels and costs are clear.",
    vendorQuoteNotes: "Alternative company proposals have not yet been finalized.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "pool-privacy-screening-standards",
    title: "Pool Privacy Screening and Design Standards",
    status: "Proposed",
    shortDescription:
      "The board is considering consistent, HOA-approved privacy-screening options for pool cages that are visible from community roads.",
    fullDescription:
      "Privacy tarps and screening placed on some pool cages have raised questions about appearance, HOA approval, and consistent streetscape standards. The board plans to discuss acceptable alternatives and whether clearer design guidance is needed.",
    estimatedCost: "Homeowner and HOA costs to be determined based on any approved standard",
    estimatedTimeline: "Proposed for board and homeowner discussion",
    boardNotes:
      "No new standard has been adopted. The goal is to identify privacy options that are practical, consistent, and compatible with the community's design requirements.",
    vendorQuoteNotes: "No vendor or quote has been selected.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "street-light-refurbishment",
    title: "Street Light Cleaning and Repainting",
    status: "Researching",
    shortDescription:
      "Duke Energy has completed an evaluation after a homeowner requested cleaning or repainting of community street-light poles.",
    fullDescription:
      "The HOA opened a Duke Energy work order to evaluate whether community street-light poles can be cleaned or repainted. The evaluation is complete, and the board is awaiting the update needed to choose a course of action.",
    estimatedCost: "To be determined from Duke Energy's evaluation",
    estimatedTimeline: "Board update and possible vote scheduled for August 13, 2026",
    boardNotes:
      "The project is intended to improve common-area appearance while confirming responsibility and available work options with Duke Energy.",
    vendorQuoteNotes: "Duke Energy completed its evaluation; final options are pending board review.",
    relatedDocuments: [augustMeetingAgenda]
  },
  {
    id: "assessment-enforcement-policy",
    title: "Assessment Collection and Enforcement",
    status: "Proposed",
    shortDescription:
      "The board is considering consistent late-fee and interest enforcement for unpaid assessments beginning with the January 1, 2027 due date.",
    fullDescription:
      "The board plans to consider enforcement of the governing-document provisions for assessments that are not paid on time. If adopted, the proposed approach would apply late fees and interest consistently beginning with assessments due January 1, 2027.",
    estimatedCost: "Administrative and collection costs to be determined",
    estimatedTimeline: "Board vote proposed for August 13, 2026; effective date would be January 1, 2027",
    boardNotes:
      "This is a proposed policy and has not yet been adopted. Any final process should follow the governing documents and applicable notice requirements.",
    vendorQuoteNotes: "No outside collection or legal quote is currently attached.",
    relatedDocuments: [augustMeetingAgenda]
  }
];

export function getAcadiaProject(projectId: string) {
  return acadiaProjects.find((project) => project.id === projectId);
}

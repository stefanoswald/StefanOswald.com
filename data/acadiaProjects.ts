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

export const acadiaProjects: Project[] = [
  {
    id: "security-cameras",
    title: "Security Cameras",
    status: "Researching",
    shortDescription:
      "Luis has assessed the current camera system and is preparing a revised proposal for updated recording equipment and access.",
    fullDescription:
      "The HOA is reviewing improvements to the community security camera system. Luis has assessed the current system and is preparing a revised proposal focused on keeping useful existing poles and cameras where practical while modernizing the recording equipment.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Revised proposal expected after system assessment",
    boardNotes:
      "The proposal is expected to include a modern Network Video Recorder system, secure access for multiple administrators, and reduced reliance on monthly cloud storage or monitoring costs.",
    vendorQuoteNotes:
      "Commercial internet service for the existing camera locations is expected to remain necessary.",
    relatedDocuments: [juneProjectUpdate]
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
      "GigaPower proposal indicates installation throughout the community at no HOA cost, subject to final review."
  },
  {
    id: "landscaping-tree-removal-replacement",
    title: "Landscaping / Tree Removal and Replacement",
    status: "Quoted",
    shortDescription:
      "Tree preservation, removal, pruning, root mitigation, sod, and landscape replacement options are being compared. Multiple bids and arborist opinions are being gathered.",
    fullDescription:
      "The HOA is comparing tree preservation against full removal and replacement, along with broader landscaping, sod, shrub, and irrigation-related needs. The work is closely connected to sidewalk timing, lawn health, and long-term streetscape maintenance.",
    estimatedCost:
      "Tree preservation proposal: $16,653.50. Tree removal proposals currently range from approximately $66,000 to $120,000. Broader landscape estimate: $136,081.05.",
    estimatedTimeline: "Additional proposals and arborist input being gathered",
    boardNotes:
      "Preserving trees could save the Association approximately $60,000 compared with complete removal and replacement, but the board is seeking additional expert input before making a recommendation.",
    vendorQuoteNotes:
      "Action Environmental provided an opinion that selective root pruning and canopy management can be performed on Southern Live Oaks if properly planned and executed. Jennifer Hitchcock, an ISA Certified Arborist and TRAQ-qualified consulting arborist, is being considered for an independent opinion costing under $600.",
    relatedDocuments: [juneProjectUpdate, actionTreeOpinion, landscapeEstimate]
  },
  {
    id: "road-assessment",
    title: "Road Assessment",
    status: "Researching",
    shortDescription:
      "Roads were last sealed in 2023. One asphalt resurfacing proposal has been received and additional information is being gathered.",
    fullDescription:
      "The community roads were last sealed in 2023, with prior related costs totaling $15,737.60. The HOA has received one asphalt resurfacing proposal and is gathering additional information to understand future maintenance needs, timing, and coordination with other infrastructure projects.",
    estimatedCost: "Prior related costs totaled $15,737.60; current resurfacing cost TBD",
    estimatedTimeline: "Information gathering and quote comparison",
    boardNotes:
      "Road scope should be coordinated with any tree, sidewalk, or utility work that may affect pavement.",
    vendorQuoteNotes: "Current quotes have not been finalized.",
    relatedDocuments: [juneProjectUpdate]
  },
  {
    id: "sidewalk-repair",
    title: "Sidewalk Repair",
    status: "Proposed",
    shortDescription:
      "Sidewalk repair is deferred until tree decisions are finalized. Two concrete sidewalk proposals have been received.",
    fullDescription:
      "Sidewalk repair remains a proposed project. The board is deferring decisions until tree preservation, root mitigation, and possible tree removal questions are resolved, since tree work may affect sidewalk scope and timing.",
    estimatedCost: "Two concrete sidewalk proposals received; final cost TBD",
    estimatedTimeline:
      "Expected sequence is damaged sidewalk removal, tree/root work, then new sidewalk installation",
    boardNotes:
      "Tree and sidewalk decisions are linked. If tree preservation is recommended, root pruning, root mitigation, and root barriers may need to occur before replacement sidewalk work.",
    vendorQuoteNotes: "Two concrete sidewalk proposals have been received.",
    relatedDocuments: [juneProjectUpdate, actionTreeOpinion]
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
    vendorQuoteNotes: "No current vendor or quote notes are available."
  },
  {
    id: "insurance-review",
    title: "Insurance Review",
    status: "Researching",
    shortDescription:
      "Annual liability premium is $442.65, paid yearly in January. Other insurance policies have been gathered for review and possible shopping.",
    fullDescription:
      "The board is reviewing current insurance coverage. The annual liability premium is $442.65, paid yearly in January. Other policies have been gathered so the board can review coverage and consider shopping options.",
    estimatedCost: "Current annual liability premium is $442.65",
    estimatedTimeline: "Research and review phase",
    boardNotes:
      "Policies have been gathered for review and possible shopping.",
    vendorQuoteNotes: "No alternate quotes have been selected yet."
  },
  {
    id: "gate-code-update",
    title: "Gate Code Update",
    status: "In Progress",
    shortDescription:
      "New gate code is 4052. Old code 1981 expires August 1, 2026. Emergency responder code remains unchanged, and code-change signage is still needed.",
    fullDescription:
      "The gate code update is in progress. The new gate code is 4052, and the old code 1981 expires August 1, 2026. The emergency responder code remains unchanged. Entrance signage explaining the code change timeline is still planned.",
    estimatedCost: "Minimal signage or communication cost expected",
    estimatedTimeline: "Old code expires August 1, 2026",
    boardNotes:
      "Emergency responder code remains unchanged. Stefan offered to create 3D-printed signage explaining the code change timeline.",
    vendorQuoteNotes: "No vendor quote is currently needed beyond signage planning."
  },
  {
    id: "bylaw-review",
    title: "Bylaw Review",
    status: "Proposed",
    shortDescription:
      "The board is reviewing outdated bylaws, tree requirements, design standards, covenants, and master agreement documents. Volunteers have not yet come forward.",
    fullDescription:
      "The board is reviewing governing documents that may need updates, including outdated bylaws, tree requirements, design standards, covenants, and master agreement documents. Documents are available through the AMG Enumerate portal, though not all documents may be uploaded yet.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Proposed for review",
    boardNotes:
      "Michele requested volunteers to review bylaws, covenants, and the master agreement to identify needed changes. No volunteers have come forward yet, and Michele has started notes.",
    vendorQuoteNotes: "No vendor or attorney quote notes are available yet.",
    relatedDocuments: acadiaGoverningRelatedDocuments
  },
  {
    id: "community-website",
    title: "Community Website",
    status: "In Progress",
    shortDescription:
      "Website for project updates and homeowner voting/feedback.",
    fullDescription:
      "A public-facing website is proposed to share HOA project updates and collect informal homeowner voting and feedback so the board can better understand community priorities.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Prototype is live for review",
    boardNotes:
      "Votes are intended as informal feedback and should not be treated as a legally binding election system.",
    vendorQuoteNotes: "No vendor or quote notes are available."
  },
  {
    id: "community-signage-and-appearance",
    title: "Community Signage and Appearance Items",
    status: "Proposed",
    shortDescription:
      "Several smaller common-area appearance items were raised, including damaged gate signage and bent or leaning no-parking signs.",
    fullDescription:
      "Several smaller community appearance items were raised for possible future attention. These include replacing or repairing damaged gate signage, reviewing no-parking signs that are bent or leaning, and improving visible common-area conditions that affect the overall streetscape.",
    estimatedCost: "To be determined",
    estimatedTimeline: "Proposed for future agenda discussion",
    boardNotes:
      "These items are smaller than the major infrastructure projects but may still improve the appearance and consistency of the community.",
    vendorQuoteNotes:
      "A prior sign vendor may no longer be available, so the board may need to identify new sign vendors or a volunteer approach for smaller sign repairs."
  }
];

export function getAcadiaProject(projectId: string) {
  return acadiaProjects.find((project) => project.id === projectId);
}

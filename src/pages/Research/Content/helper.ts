const researchCommentUrlPattern = /#update_[\w\d]+-comment:/;
const researchCommentSectionPattern = /-comment:[\w\d]*/;

export const getResearchCommentId = (s: string) => s.replace(researchCommentUrlPattern, '').trim();

export const getResearchUpdateId = (s: string) =>
  s.replace('#update_', '').replace(researchCommentSectionPattern, '').trim();

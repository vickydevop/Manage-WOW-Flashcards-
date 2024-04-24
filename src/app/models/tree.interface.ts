export interface TreeSyllabus {
  syllabus_id: string;
  syllabus_parent_id?: string;
  syllabus_name: string;
  is_hidden: boolean | string | number;
  children: TreeSyllabus[];
  level?: number;
  expandable?: boolean;
  id: number;
}

export interface SyllabusTree {
  syllabus_id: string;
  syllabus_parent_id?: string;
  syllabus_name: string;
  is_hidden: boolean | string | number;
  children: SyllabusTree[];
  level?: number;
  expandable?: boolean;
}

export interface DialogData {
  syllabus_name: string;
  Component: string;
  parent: SyllabusTree;
  isTop: boolean;
}

export interface TreeData {
  syllabus_id: any;
  category_id: string;
  parent_category_id?: string;
  category_name: string;
  ishidden: boolean | string | number;
  children: TreeData[];
  level?: number;
  expandable?: boolean;
}

// export interface DialogData {
//   category_name: string;
//   Component: string;
//   parent: TreeData;
//   isTop: boolean;
// }

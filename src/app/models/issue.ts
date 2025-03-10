export interface ApiResponse { // interface for the whole api response 
    count: number; 
    data: Issue[]; // The actual issues are inside the `data` property
    pageIndex: number; // The current page number
    pageSize: number;   // The number of issues per page
    totatIssues: number; // The total number of issues
  }

export interface Issue { // interface for the issue with all its attributes
    "createdById": '';
    "createdOn": '';
    "updatedById": '';
    "updatedOn": '';
    "id": '';
    "title": '';
    "description": '';
    "latitude": '';
    "longitude": '';
    "address"?: '';
    "priority": '';
    "status": '';
    "category":'';
    "images": [];
}

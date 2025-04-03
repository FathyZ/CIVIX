export interface ApiResponse { // interface for the whole api response 
    count: number; 
    data: Issue[]; // The actual issues are inside the `data` property
    pageIndex: number; // The current page number
    pageSize: number;   // The number of issues per page
    totatIssues: number; // The total number of issues
  }

  export interface Issue {
    createdById: string;  // userId or similar type
    createdOn: Date;      // Date type is more appropriate
    updatedById: string;  // userId or similar type
    updatedOn: Date;      // Date type is more appropriate
    id: string;           // Unique identifier for the issue
    title: string;        // Title of the issue
    description: string;  // Description of the issue
    latitude: string;     // Latitude coordinate (number)
    longitude: string;    // Longitude coordinate (number)
    address?: string;     // Optional address
    priority: string;     // Priority level (string, possibly an enum)
    status: string;       // Current status (string, possibly an enum)
    category: string;     // Category of the issue
    images: string[];     // Array of image URLs or paths (string array)
}

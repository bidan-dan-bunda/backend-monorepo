export const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
export const apiUrl = `${baseUrl}/api/v1`;
export const authUrl = `${apiUrl}/auth`;

export const GETOnlyResources = [
  'locations/provinces',
  'locations/regencies',
  'locations/districts',
  'locations/villages',
];

export const allMethodsResources = ['videomateri', 'videos', 'puskesmas'];

export const resourcesWithUploads = [
  { name: 'videos', postfixPath: 'thumbnail', imageField: 'thumbnail' },
  { name: 'videomateri', postfixPath: 'thumbnail', imageField: 'thumbnail' },
  {
    name: 'puskesmas',
    postfixPath: 'profile-image',
    imageField: 'profile_image',
  },
];

interface ISiteMetadataResult {
  siteTitle: string;
  siteUrl: string;
  description: string;
  logo: string;
  navLinks: {
    name: string;
    url: string;
  }[];
}

const getBasePath = () => {
  const baseUrl = import.meta.env.BASE_URL;
  return baseUrl === '/' ? '' : baseUrl;
};

const data: ISiteMetadataResult = {
  siteTitle: 'Geng Niu',
  siteUrl: 'https://run.gengniu.org',
  logo: 'https://img.gengniu.org/2026/08/cc3b3ad9.jpg',
  description: 'Personal site and blog',
  navLinks: [
    {
      name: 'Summary',
      url: `${getBasePath()}/summary`,
    },
    {
      name: 'Blog',
      url: 'https://gengniu.org',
    },
    {
      name: 'About',
      url: 'https://gengniu.org/#about',
    },
  ],
};

export default data;

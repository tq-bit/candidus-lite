const buildIndex = (posts) => {
  const documents = posts.map((post) => {
    const blueprint = JSON.stringify({
      title: post.title,
      url: post.url,
    });
    return {
      blueprint,
      title: post.title,
      excerpt: post.excerpt,
      html: post.html,
    };
  });

  const lunrIndex = lunr(function () {
    this.ref('blueprint');
    this.field('title');
    this.field('excerpt');
    this.field('html');
    documents.forEach(function (doc) {
      this.add(doc);
    }, this);
  });
  return lunrIndex;
};

onmessage = ({ data }) => {
  const lunrIndex = buildIndex(data);
  const serializedIndex = JSON.stringify(lunrIndex);
  postMessage(serializedIndex);
};

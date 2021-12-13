const Store = require('electron-store');

const store = new Store();
if (store.get('links') === undefined) {
  store.set('links', []);
}
export const getMaxId = (arr: any[]) => {
  if (!arr.length) return -1;
  const ids = arr.map((object: any) => {
    return object.id;
  });

  return Math.max(...ids);
};

export const addLink = (title: any, link: any) => {
  const links = store.get('links');
  const maxId = getMaxId(links);
  links.push({ id: maxId + 1, title, link });
  store.set('links', links);
};

export const deleteLink = (id: any) => {
  const links = store.get('links');
  const index = links.findIndex(function (o: any) {
    return o.id === id;
  });
  if (index !== -1) links.splice(index, 1);
  store.set('links', links);
};

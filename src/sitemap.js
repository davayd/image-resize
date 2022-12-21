import { photoSessionMap, sitemapPath, teamMembersPath } from "./constants.js";
import { transliterator, appendFileAsyc, rimrafAsync } from "./utils.js";

const siteMap = {
  1: {
    routePath: photoSessionMap.Olya,
  },
  2: {
    routePath: photoSessionMap.Polina2,
  },
  3: {
    routePath: photoSessionMap.Ayna,
  },
  4: {
    routePath: photoSessionMap.Polina1,
  },
  5: {
    routePath: photoSessionMap.PolinaStudio2,
  },
  6: {
    routePath: photoSessionMap.PolinaStudio1,
  },
  7: {
    routePath: photoSessionMap.Anastasia,
  },
  9: {
    routePath: photoSessionMap.Miron,
  },
};

const transliteratedSiteMap = Object.entries(siteMap).reduce(
  (acc, [key, value]) => {
    acc[key] = { ...value, routePath: transliterator(value.routePath) };
    return acc;
  },
  {}
);

const teamMembersMap = {
  [transliterator(photoSessionMap.Miron)]: {
    Model: ["Miron (instagram: aelarph)"],
    MA: ["Bacca Models (instagram: baccamodels)"],
  },
  [transliterator(photoSessionMap.Anastasia)]: {
    Model: ["Anastasia Maslovskaya (instagram: mas.lovskaya)"],
    MA: ["INMODELS (instagram: inmodels.agency)"],
  },
  [transliterator(photoSessionMap.PolinaStudio1)]: {
    Model: ["Polina (instagram: mdam_s)"],
    Designer: ["Vera Steklova (instagram: verasteklova)"],
    Muah: ["Кристина Яковлева  (instagram: yakovleva.muah)"],
  },
  [transliterator(photoSessionMap.PolinaStudio2)]: {
    Model: ["Polina (instagram: mdam_s)"],
    Muah: ["Кристина Яковлева  (instagram: yakovleva.muah)"],
  },
  [transliterator(photoSessionMap.Polina1)]: {
    Model: ["Polina (instagram - mdam_s)"],
  },
  [transliterator(photoSessionMap.Ayna)]: {
    Model: ["Ayana Erdyneeva (instagram - ayaerdy)"],
  },
  [transliterator(photoSessionMap.Polina2)]: {
    Model: ["Polina (instagram - mdam_s)"],
  },
  [transliterator(photoSessionMap.Olya)]: {
    Model: ["Olya (instagram - olya_bonheur)"],
  },
};

(async function () {
  await rimrafAsync(sitemapPath);
  await rimrafAsync(teamMembersPath);

  await appendFileAsyc(
    sitemapPath,
    `export const SITE_MAP: Record<string, { routePath: string}> = ${JSON.stringify(
      transliteratedSiteMap
    )}`
  );

  await appendFileAsyc(
    teamMembersPath,
    `export const TEAM_MEMBERS: Record<string,  { [key: string]: string[]}> = ${JSON.stringify(
      teamMembersMap
    )}`
  );
})();

---
id: environmental-impact
title: Overview
---

# Environmental Impact

## Understanding website weight

The amount of bandwidth the platform uses depends on 2 main factors:

1. Have you visited it before?
2. Have you visited it recently?

The bandwidth transfer consists of

- Core platform
- Database sync
- Rendered content

Tools in place to reduce bandwidth

- locally cached database (only syncs with server when new info available)
- server-compressed images (resizes all images to have max 1200px width ~ 50kb)
- core platform pre-cache via service worker (only downloaded on new release ~ monthly)
- on-the-fly image caching via service worker (all images cached locally, purged yearly)

As a worst-case scenario, a new user visiting the site automatically lands on the howto page and downloads:

```
- Full platform (for all pages) ~ 1MB
- Full database (for all pages) ~ 1KB
- Full list of rendered howtos ~ 9MB
  Total ~ 10MB
```

![Example first visit page weight](https://i.ibb.co/G3NFsDQ/Picture1.png)

Whilst browsing the site the user will download the following:

```
- Profile content on demand (images cached on the fly)
- Howto rendered content on first open  (cached on the fly)
- Map tiles on first open (cached on the fly)
- Academy pages on every open (not cached, is an iframe)
Total ~1MB
```

![Page weight on revisit](https://i.ibb.co/nb2MVtg/Picture2.png)

Returning to the site some days/weeks later the user will download:

```
- Core platform updates (released monthly, full 1MB again)
- New howtos
- New content for pages visited (if not previously visited)
Total ~2MB
```

### Monitoring webpage weight

The easiest way to do this is open devtools (F12) and swap to the network tab. As you browse you will see the number of MBs **transferred**. Do not confuse this with the resources size, as that includes cached resources also.

## Plans to reduce

There are various issues and places this has been discussed, the most up-to-date information can likely be found within issues tagged `global good`  
https://github.com/ONEARMY/community-platform/labels/Global%20Good%20%F0%9F%8C%8D

---

## Legacy Docs

Most of this is covered in the 'Big Corporations' discussion, however a few points for the site we are building are:

1. We want to be advanced in terms of lessening the environmental impact of the platform we produce.

2. Many of the biggest wins don't come from intense optimisation, but limiting replication/duplication and the constant redownload of the same files

3. We have image compression in place for all uploaded images, and a service worker to cache both core platform and content

> loading the core platform along with docs page, including all current tutorials and cover images has a total of 12.5kb
> ![image](https://i.ibb.co/3BZQ8g1/Picture1.png)

This discussion took place on slack v4-website-dev on January 17th 2019

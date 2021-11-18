![CI status](https://github.com/JarnoRFB/planted-co2-calculator/actions/workflows/ci.yml/badge.svg) ![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=planted-co2-calculator)

# planted-co2-calculator

A transparency-first carbon footprint calculator for quickly estimating your personal carbon footprint.

Try out the [German version](https://calculator.planted.green/de) or the
[English version](https://calculator.planted.green/en)!

## Design principles

### Transparency first

> [All models are wrong but some are useful.](https://en.wikipedia.org/wiki/All_models_are_wrong)

Yet to be useful one needs to be able to see the model. That is why this project puts transparency-first.
All numbers behind the estimations are backed by linked sources that are tracked throughout the calculation.
The sources are presented to the user together with the original data.

Moreover each source has a notion of validity attached, that is checked during each calculation. Whether or not the sources
are still valid is presented to the user as well. Currently we check whether the sources were added more then one year ago,
but more elaborated ways of ensuring validity, such as checking for new data on a website, are possible.
This way we can make sure that the estimates are still up to date and don't forget to update our sources in time.
If you notice a stale source, please open an [issue](https://github.com/JarnoRFB/planted-co2-calculator/issues).

Finally, the source code is of course open source, so that technical users can review the exact calculations in full detail.

Some estimation methods and sources could definitely be improved, but we prefer to open an imperfect model to criticism, then to keep
a supposedly super accurate model behind closed doors. This way, errors and improvement potentials are much more likely to be fixed and realized.

Especially when environmental concerns become integral parts of marketing strategies, green washing offers an easy shortcut.
Only by insisting on transparency, we can make sure that our efforts actually have an effect and are not just
easing our conscience.

### Simplicity

The questions focus on five factors that make the biggest impact on one's personal carbon footprint. While other factors play important roles
as well, we do not want to overwhelm the user and instead focus on the most important factors.
The calculations use nation based averages to enable users to quickly estimate their footprint, without having to research a lot of
numbers. While e.g. knowing ones exact energy consumption in kWh allows for more precise estimates, one seldomly has these numbers handy.

### Reactivity

The UI updates on every input and gives the user direct visual feedback on how their actions influence their carbon footprint.
This way the user can get a feeling for the carbon impact of different factors.

### Internationalization

The UI is fully internationalized to enable people from all backgrounds to use the app. Currently English and German are supported.
While the numbers currently only make sense for people living in Germany, adding estimates for other countries is extremely welcome.

For adding a new language:

1. Add a new json file under `src/locales/`, providing translations for all keys. These translations are used for the UI.
2. Under `lib/estimations/sources/index.ts` add a new field for the new language to the `LocalizedDescription` interface.
3. Provide translation for all sources under `lib/estimation`.

## Contributing

The project is written in typescript, the frontend in Vue 3. To get started you only need `npm`.

**Project setup**

```
npm install
```

**Compiles and hot-reloads for development**

```
npm run serve
```

**Runs unit tests**

npm test

**Compiles and minifies for production**

```
npm run build
```

**Lints and fixes files**

```
npm run lint
```

## In the news

- The planted CO2 calculator was features in a [newspaper article](https://www.welt.de/regionales/nrw/article233822136/Koelner-Start-up-entwickelt-neuen-CO2-Rechner.html) in WELT.
  WELT.

## Acknowledgments

Thanks to [PLANTED](https://planted.green) for supporting the development of this project by giving it a concrete use case.
PLANTED applies the transparency-first principle at the company level and is an excellent choice for easily compensating your carbon footprint.

Some of the more complex calculations are powered by [bloom-contrib](https://github.com/tmrowco/bloom-contrib) from
[Tomorrow](https://www.tmrow.com/). Tomorrow pioneered open source carbon footprint calculation and and was a strong
inspiration for this project. Make sure to check out their products [bloomclimate.com](https://bloomclimate.com/) for
carbon footprint analysis for companies, and [electricitymap.org](https://www.electricitymap.org/map) for
a live map and API of the world's electricity data.

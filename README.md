# Global AI Capacity Atlas

**An evidence-linked country research atlas covering models, compute, data, applications, power, and capital.**

Chinese title: **全球AI基础能力梯度图谱 / AI基础能力梯度图谱**. The website and most research records are in Chinese; this README is the English entry point for readers, researchers, and AI agents.

[Explore the website](https://kylinr.github.io/ai-atlas/) · [Read the research JSON](https://kylinr.github.io/ai-atlas/research-data.json) · [Browse the repository](https://github.com/Kylinr/ai-atlas)

## At a glance

| Item | Current published snapshot |
| --- | --- |
| Research edition | `06` |
| Research review date | `2026-11-09` |
| Country coverage | 31 selected countries: Global South markets and major technology suppliers |
| Primary dimensions | Models · Compute · Data · Applications · Power · Capital |
| Model and data evidence | 68 representative model/series entries and 53 data-resource entries across 31 countries |
| Purpose | Compare documented foundations, inspect sources, and identify research gaps |
| Interpretation | Separate dimension-specific assessments; **not a single overall ranking of national AI strength** |

Entry counts describe this research sample, not national totals. The review date is not the observation date of every indicator. Read each dimension's `period` and each record's dates. These README figures describe edition 06; for subsequent updates, use `meta` in the research JSON.

## Direct access for researchers and AI agents

Start with **`research-data.json`**. It contains the research records used by the website and can be fetched without executing JavaScript, authenticating, or obtaining an API key. The HTML page renders its country details with JavaScript, so fetching only `index.html` will not retrieve the full research content.

| Resource | Direct URL | Use |
| --- | --- | --- |
| Research dataset | [GitHub Pages JSON](https://kylinr.github.io/ai-atlas/research-data.json) | Preferred entry point for all six dimensions, methods, evidence, sources, and gaps |
| Same dataset on GitHub | [Raw JSON](https://raw.githubusercontent.com/Kylinr/ai-atlas/main/research-data.json) | Alternative when GitHub Pages is unavailable |
| This README | [Raw Markdown](https://raw.githubusercontent.com/Kylinr/ai-atlas/main/README.md) | Plain-text project discovery and reading guidance |
| Open-model sample and methodology | [HF ecosystem JSON](https://kylinr.github.io/ai-atlas/hf-ecosystem-sample-20261107.json) | Selected publisher accounts, metric definitions, coverage, and download statistics |
| Repository-level HF snapshot | [HF repository JSON](https://kylinr.github.io/ai-atlas/hf-repository-snapshot.json) | Inspect the underlying account/repository observations |
| Archived HF API responses | [ZIP archive](https://kylinr.github.io/ai-atlas/hf-raw-api-20261107.zip) | Audit the collected API responses; not a model-weight download |
| Operational IDC sample | [2025 Q2 CSV](https://kylinr.github.io/ai-atlas/idc-live-it-capacity-2025q2-public.csv) | Tracked live IT capacity, scope, period, and source |
| Private AI investment source table | [2025 CSV](https://kylinr.github.io/ai-atlas/capital-private-ai-2025.csv) | Published country observations; amounts are in billions of US dollars |

These are static files, not query APIs. Fetch the JSON once and filter locally. CSV source tables can cover a different set of countries from the atlas. The IDC CSV has a UTF-8 byte-order mark; Python readers can use `encoding="utf-8-sig"`.

### Recommended reading sequence

1. Read `meta` for the edition, review date, scope, and update scope.
2. Select the relevant object in `dimensions` by its `id`. Read `metric`, `period`, `methodology`, `limitations`, `notice`, and `tiers` before comparing records.
3. Select its `records` by `country`, joined to `countries[].id`. Read `facts`, `sources`, `caveats`, and `nextChecks` alongside the displayed value and analytical `reason`.
4. For model or data research, inspect the nested `models` or `datasets` entries, including their individual dates, status, permissions, and source links.
5. Use `views` for the open-model sample and network context. Read `audit` for current review notes and unresolved gaps.
6. Follow the cited original sources before making a new current-status claim. Cite the original evidence and identify any interpretation or conversion performed by the atlas.

Do not treat `previousAudit`, `previousAssessment`, or `historicalReference` as the current assessment. `researchEvidence.countries` overlaps with the model/data evidence embedded in dimension records; it is an alternative research-oriented representation, not an additional set of observations to add to the counts.

### Retrieval example (Python standard library)

This example retrieves Saudi Arabia's model record together with its methodology and snapshot metadata. Change `country_id` and `dimension_id` to select another record.

```python
import json
from urllib.request import urlopen

url = "https://kylinr.github.io/ai-atlas/research-data.json"
with urlopen(url, timeout=30) as response:
    atlas = json.load(response)

country_id = "SA"
dimension_id = "models"
country = next(c for c in atlas["countries"] if c["id"] == country_id)
dimension = next(d for d in atlas["dimensions"] if d["id"] == dimension_id)
record = next(r for r in dimension["records"] if r["country"] == country_id)

result = {
    "meta": atlas["meta"],
    "country": country,
    "dimension": dimension["id"],
    "metric": dimension["metric"],
    "period": dimension["period"],
    "methodology": dimension["methodology"],
    "limitations": dimension["limitations"],
    "record": record,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
```

## Dimensions and interpretation

| ID | Dimension | Published basis | Important boundary |
| --- | --- | --- | --- |
| `models` | Model development | Country-level development evidence and model lineage; version-specific dates, reviewed 2026-11-09 | Distinguishes training from scratch, evolution from domestic predecessors, adaptation of external weights, and application deployment. Frontier performance tiers retain the dated 2026-11-07 snapshot; absence from a leaderboard is not absence of capability. |
| `compute` | Compute | Epoch AI estimates of cumulative accelerator arrivals/retention, 2022 Q1–2026 Q2, expressed as H100 equivalents | H100e is a theoretical peak-performance conversion, not a physical H100 count, a single interconnected cluster, measured utilization, or actual training throughput. |
| `data` | Data access and corpora | Country-specific institutions, platforms, corpora, and datasets; individually dated, reviewed 2026-11-09 | Resource existence, download access, commercial training rights, and quality evidence are separate questions. Countries are grouped for navigation, not ranked by resource counts. |
| `applications` | AI use | Microsoft AI Diffusion Report, 2026 Q2 / June reading | Estimated generative-AI use among people aged 15–64; not paid revenue, renewal rate, API volume, domestic product supply, or model-provider market share. Some observations use regional estimates. |
| `power` | Operational data-center capacity | 2025 Q2 live IT capacity from Bloomberg–DC Byte, reproduced in a June 2026 Banca d'Italia paper | A tracked-facility sample, not a national census or AI-only capacity. The published table covers 11 of the atlas's 31 countries. Construction and power-supply information appears only as country context. |
| `capital` | Private AI investment | Full-year 2025 private AI financing, Stanford AI Index / Quid | Financing under the source's company-location and transaction definitions; not total national AI expenditure, government support, infrastructure capex, or investor nationality. |

Auxiliary views in `views`:

- `models-open`: selected official publisher accounts on Hugging Face; public repositories, repositories with weights, and recent 30-day downloads, collected 2026-11-07. Download counts are not unique users or commercial adoption, and repository counts are not unique foundational models.
- `network-speed-fixed` and `network-speed-mobile`: full-year 2025 download-speed observations.
- `network`: internet-use context, mainly 2024 observations from a 2026 publication. Network indicators remain supporting context under applications, not a seventh primary dimension.

### Comparison rules

- **Keep geography explicit.** A company's worldwide fleet is not the capacity located within its headquarters country. Do not assign a global corporate plan to one country's domestic total.
- **Keep units explicit.** IT capacity, facility power capacity, contracted electricity supply, measured load, and annual electricity use describe different quantities. GW is power; TWh is energy. Dividing annual energy by hours gives average load, not installed capacity.
- **Keep project status explicit.** Operational, partially delivered, under construction, contracted, and planned capacity must not be combined as if all were live. Country supplements do not change the operational baseline tier.
- **Keep evidence separate from judgment.** `tier` and `reason` describe the atlas's analytical assessment; source-linked facts and methods explain what supports it. Tiers are not official national grades and are not added into a composite score.
- **Preserve unknowns.** `tier: 0` means unranked, insufficient comparable evidence, or a deliberately unscored evidence view. It does not mean zero capability. Do not replace missing values, `null`, or “暂未查到” (reliable information not found in this review) with numerical zero.
- **Preserve scope and rights.** Open weights do not imply open training data. A downloadable corpus does not automatically permit commercial training. An organization's establishment, a catalog entry, or a planned platform is not evidence that a training dataset is available.

## Data structure

| Location in `research-data.json` | Contents |
| --- | --- |
| `meta` | Title, edition, review date, scope, status, attribution, and update scope |
| `countries[]` | `id`, Chinese `name`, English `en`, region, display order, and aliases |
| `dimensions[]` | Six primary dimensions, their methods, tier definitions, and country records |
| `views[]` | Auxiliary views with their own methods and records |
| `dimensions[].records[]` | Country key, displayed `value`, optional numeric fields, dates/status, analytical `tier` and `reason`, `facts`, `sources`, `caveats`, and `nextChecks` |
| Model records: `models[]` | Institution, model name/version, release date, route, base model, route evidence, weights, languages, modalities, status, sources, and `checkedAt` |
| Data records: `datasets[]` | Institution, resource, release/status, languages/types, use cases, access, license, commercial-training status, restrictions, quality evidence, sources, and `checkedAt` |
| Power records: `supplementaryProjects`, `supplementaryPower`, `supplementaryProgram` | Optional project and power context; not added to the live-capacity baseline |
| `researchEvidence.countries[]` | Model/data research files keyed by `code`, including summaries and gaps; overlaps with dimension records |
| `audit` / `previousAudit` | Current review notes and gaps / previous review context |

Common source fields are `title`, `url`, `publisher`, `date`, and optional `locator`. `date` usually describes the source publication or a dated statement; `period` describes the observation period; `checkedAt` describes the review date. Some dates remain text such as “exact release date not verified.” Fields can be optional, and some descriptive fields are strings while others are arrays. Inspect the actual JSON instead of assuming a uniform numeric schema.

Model `route` values:

| Value | Meaning |
| --- | --- |
| `scratch` | Evidence of pretraining from scratch for the stated model or lineage scope |
| `domestic-continuation` | Continued training or post-training of a domestic predecessor |
| `adaptation` | Continued pretraining or post-training based on external existing weights |
| `deployment` | Application deployment of an external model |
| `unknown` | Training initialization or lineage not reliably established |

Using another model's architecture does not, by itself, establish use of its weights. Data-resource `commercialTraining` values include `allowed`, `conditional`, `prohibited`, and `unclear`; always read the accompanying license and restriction text.

## Country coverage and page links

This is a selected research scope, not a definition of the Global South or an exhaustive list of countries with AI activity.

- **Asia:** China `CN`, Japan `JP`, South Korea `KR`, India `IN`, United Arab Emirates `AE`, Saudi Arabia `SA`, Singapore `SG`, Malaysia `MY`, Indonesia `ID`, Vietnam `VN`, Thailand `TH`, Kazakhstan `KZ`, Türkiye `TR`, Philippines `PH`, Pakistan `PK`, Bangladesh `BD`.
- **Africa:** South Africa `ZA`, Kenya `KE`, Nigeria `NG`, Egypt `EG`, Morocco `MA`, Ethiopia `ET`.
- **Latin America:** Brazil `BR`, Mexico `MX`, Chile `CL`, Argentina `AR`.
- **European and North American comparators:** United States `US`, United Kingdom `GB`, France `FR`, Germany `DE`, Canada `CA`.

Human-readable country links use the fragment pattern `#<dimension-id>/<country-id>`, for example [Saudi model evidence](https://kylinr.github.io/ai-atlas/#models/SA), [Chinese data resources](https://kylinr.github.io/ai-atlas/#data/CN), and [US operational IDC evidence](https://kylinr.github.io/ai-atlas/#power/US). Also see the [coverage matrix](https://kylinr.github.io/ai-atlas/#coverage) and [review notes](https://kylinr.github.io/ai-atlas/#review). URL fragments navigate the client-side page; they are not server-side data filters.

## Citation, freshness, and reuse

For a specific claim, cite its original source, observation date, scope, and relevant limitation. When using the atlas's classification, calculation, or compilation, also cite **Global AI Capacity Atlas, edition 06, reviewed 2026-11-09**, the relevant country/dimension link, and your retrieval date. Cite future editions using their own metadata.

The `main` branch and GitHub Pages show the current published files. For reproducible research, record the Git commit and use a commit-pinned file URL. For example, the [edition 06 research snapshot at commit `af91caf`](https://raw.githubusercontent.com/Kylinr/ai-atlas/af91caf5e16e309a88a9446b8ff9bbb5232c3771/research-data.json) preserves the data published in that commit.

This is a dated research publication, not a real-time monitoring service. A reviewed claim can become outdated, and some original portals require registration or restrict access. Where reliable information was not found, the records retain the gap instead of asserting that the capability or resource does not exist.

Third-party reports, datasets, models, and archived responses retain their respective rights and license conditions. This README does not grant a blanket license to train on, redistribute, or commercially reuse all linked material. Consult the original source and the individual resource's license fields; the repository does not currently include a project-wide `LICENSE` file.

## Repository and local preview

| File | Role |
| --- | --- |
| `index.html` | Static page structure and entry point |
| `app.js` | Dimension navigation, country details, source links, and data export |
| `style.css` | Desktop and mobile presentation |
| `research-data.json` | Machine-readable published research snapshot |
| `data.js` | The same research payload assigned to `window.ATLAS_DATA` for browser rendering |
| `hf-*.json`, `hf-raw-api-20261107.zip` | Hugging Face sample, repository observations, and archived collection responses |
| `*.csv` | Supporting IDC and investment source tables |
| `.nojekyll` | GitHub Pages static-file publishing marker |

The site is served from the root of the `main` branch using GitHub Pages. No frontend build step is needed to preview these published files:

```bash
git clone https://github.com/Kylinr/ai-atlas.git
cd ai-atlas
python3 -m http.server 8000
```

Then open [the local preview](http://localhost:8000/). If changing research data, keep `research-data.json` and the payload in `data.js` synchronized; the live interface reads `data.js`.

To propose a correction, use [GitHub Issues](https://github.com/Kylinr/ai-atlas/issues) or a pull request. Include the country, dimension, affected claim, original source URL, publication/observation dates, metric and geographic scope, and whether the evidence concerns an operational asset or a future plan.

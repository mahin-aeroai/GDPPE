**GLOBAL DIGITAL PRINT PRODUCTION EQUIPMENT ENCYCLOPEDIA (GDPPE)**

**Master Research & Data Collection Specification**

**Chapter 6 -- Master Research Database Architecture & Excel/CSV
Schema**

**6.1 Purpose**

The purpose of this chapter is to define the **Master Research Database
Architecture** that will store, organize, validate, and maintain every
piece of information collected for the Global Digital Print Production
Equipment Encyclopedia (GDPPE).

This database is **not** intended to be a traditional ERP or SQL
database. It is a **research-first architecture**, optimized for:

-   Large-scale research

-   Continuous updates

-   Data validation

-   Technical documentation

-   AI-powered search

-   HTML encyclopedia generation

-   Power BI dashboards

-   Future migration to SQL, PostgreSQL, Neo4j, Elasticsearch, or Graph
    databases

The initial implementation will use **Microsoft Excel
(.xlsx)** and **CSV** files because they are universally accessible,
easy to maintain, and compatible with virtually every BI and database
platform.

**6.2 Design Principles**

The research database shall be designed around the following principles:

**Principle 1 --- Single Source of Truth**

Every machine, manufacturer, printhead, software product, and material
shall exist only once within the database.

Duplicate records are prohibited.

**Principle 2 --- Normalized Structure**

Avoid storing repeated information.

Example:

Instead of writing:

Canon

Japan

www.cpp.canon

500 times,

create one Manufacturer record

and link every machine to it.

**Principle 3 --- Expandable Architecture**

The database must support:

-   10,000+ machines

-   2,000+ manufacturers

-   100,000+ technical documents

-   Millions of technical data points

without redesign.

**Principle 4 --- Category Independence**

Every technology category has different specifications.

The database shall support

Technology-specific fields

rather than forcing one universal template.

**Principle 5 --- AI Ready**

Every record shall be suitable for

Semantic Search

GraphRAG

Knowledge Graph

LLMs

AI Agents

Vector Search

**6.3 Database Architecture Overview**

The Master Workbook shall contain multiple linked sheets.

GDPPE MASTER DATABASE

│

├── Dashboard

├── Manufacturers

├── Equipment Master Index

├── Product Families

├── Machine Models

├── Printheads

├── Ink Systems

├── RIP Software

├── Materials

├── Accessories

├── Dealers

├── Service Centres

├── Documentation

├── Images

├── Videos

├── Research Log

├── Sources

├── Relationships

├── Knowledge Graph

├── Validation

└── Change Log

**6.4 Workbook Structure**

**Sheet 1**

**Dashboard**

Purpose

Overall statistics

Contains

-   Total Manufacturers

-   Total Machines

-   Current Models

-   Discontinued Models

-   Research Progress

-   Category Completion

-   Confidence Score

-   Missing Data Report

**Sheet 2**

**Equipment Master Index**

One row = One machine

This is the central table.

No specifications stored here.

Only identity.

**Sheet 3**

**Manufacturers**

One row = One company

Contains

-   Company

-   Country

-   Website

-   Year Founded

-   Parent Company

-   Status

**Sheet 4**

**Product Families**

Examples

Arizona

VUTEk

P5

Nyala

JFX

G3

Kongsberg X

**Sheet 5**

**Machine Specifications**

Technology-specific data.

Each machine linked using

Equipment ID.

**Sheet 6**

**Printheads**

Every printhead

One record each.

**Sheet 7**

**Ink Systems**

Every ink chemistry

Every OEM ink

Every compatible ink

**Sheet 8**

**RIP Software**

One row

One product.

**Sheet 9**

**Materials**

PVC

PET

Fabric

Canvas

Foam Board

ACP

Glass

etc.

**Sheet 10**

**Tool Modules**

Especially for

Digital Cutters.

Examples

UCT

EOT

POT

KCT

VCT

Router

Creasing

**Sheet 11**

**Dealers**

Country

City

Company

Brand

Coverage

**Sheet 12**

**Service Centres**

Company

Country

Engineers

AMC

Warranty

**Sheet 13**

**Documentation**

Brochure

Datasheet

Manual

Installation

Service

Parts

Firmware

**Sheet 14**

**Images**

Every image stored once.

Linked using Equipment ID.

**Sheet 15**

**Videos**

YouTube

Official

Training

Maintenance

**Sheet 16**

**Research Sources**

Every URL.

Every PDF.

Every catalogue.

Every publication.

**Sheet 17**

**Relationships**

Machine

↓

Printhead

↓

Ink

↓

RIP

↓

Media

↓

Cutter

↓

Laminator

↓

Software

↓

Dealer

**Sheet 18**

**Validation**

Missing Fields

Broken Links

Duplicate Models

Unverified Records

**Sheet 19**

**Change Log**

Every edit

Version

Date

Reason

Researcher

**6.5 Folder Structure**

The research library shall follow a consistent folder hierarchy.

GDPPE

├── 01_Manufacturers

├── 02_Machines

├── 03_Brochures

├── 04_Datasheets

├── 05_User_Manuals

├── 06_Service_Manuals

├── 07_Parts_Manuals

├── 08_Firmware

├── 09_Images

├── 10_Videos

├── 11_Research

├── 12_Trade_Shows

├── 13_Patents

├── 14_Historical

└── 15_Archive

**6.6 Equipment Master Index Fields**

Every machine shall include:

**Identity**

-   Equipment ID

-   Category

-   Subcategory

-   Manufacturer

-   Family

-   Model

-   Series

-   Generation

-   Status

**Research**

-   Research Status

-   Completion %

-   Confidence

**Business**

-   Country

-   Launch Year

-   End Year

**Documentation**

-   Website

-   Brochure

-   Datasheet

-   Manuals

No technical specifications shall be stored in this sheet.

**6.7 Technology-Specific Specification Sheets**

Each equipment category shall have its own specification worksheet.

Examples:

UV Printers

↓

Printer fields

Digital Cutters

↓

Tool fields

Heat Transfer

↓

Temperature fields

Sewing

↓

Needle fields

Laser

↓

Laser fields

Never force one category into another.

**6.8 Primary Keys**

Every sheet shall use permanent IDs.

Examples

Manufacturer ID

Machine ID

Printhead ID

Ink ID

Software ID

Material ID

Dealer ID

Document ID

Relationship ID

**6.9 Relationship Keys**

Examples

Machine ID

↓

Manufacturer ID

Machine ID

↓

Printhead ID

Machine ID

↓

RIP ID

Machine ID

↓

Ink ID

Machine ID

↓

Media ID

Machine ID

↓

Cutter ID

**6.10 Naming Standards**

All filenames shall follow a standard convention.

Example

Manufacturer_Model_DocumentType_Revision_Year.pdf

Canon_Arizona2380_Brochure_2025.pdf

Zund_G3_ServiceManual_v3.pdf

**6.11 CSV Standards**

Every sheet shall be exportable as an independent CSV.

Encoding

UTF-8

Delimiter

Comma

Date Format

YYYY-MM-DD

Decimal

.

Units

Metric

**6.12 Unit Standards**

Length

Millimetres (mm)

Area

Square Metres (m²)

Speed

m²/hr

Power

kW

Voltage

V

Current

A

Weight

kg

Pressure

bar

Temperature

°C

Frequency

Hz

Resolution

dpi

Drop Size

pL

Always store units separately from values where practical.

**6.13 Data Validation Rules**

Mandatory fields:

-   Equipment ID

-   Manufacturer

-   Model

-   Category

-   Status

Optional fields:

Only if not publicly available.

No blank mandatory fields.

**6.14 Version Control**

Every workbook update shall include:

-   Version Number

-   Date

-   Editor

-   Summary of Changes

No record shall be overwritten without maintaining history.

**6.15 Future Database Compatibility**

The workbook shall be designed so it can later migrate to:

-   PostgreSQL

-   Microsoft SQL Server

-   MySQL

-   SQLite

-   MongoDB

-   Neo4j

-   Elasticsearch

-   Qdrant

-   Weaviate

-   Pinecone

without structural redesign.

**6.16 Power BI Readiness**

The architecture shall support:

-   Manufacturer dashboards

-   Technology dashboards

-   Market analysis

-   Geographic distribution

-   Product lifecycle analysis

-   Research completion metrics

-   Missing data reports

-   Document coverage

-   Knowledge graph visualizations

**6.17 HTML Encyclopedia Integration**

The HTML application shall **never contain hard-coded technical data**.

Instead, it shall:

-   Read data from the structured workbook (or exported JSON generated
    from it).

-   Build category pages dynamically.

-   Generate machine pages from the database.

-   Populate comparison tables automatically.

-   Display related documents, images, and videos through linked
    records.

The research database remains the authoritative source.

**6.18 Security & Data Governance**

The database shall distinguish between:

-   **Publicly Verifiable Data** (manufacturer specifications,
    brochures, manuals, product information)

-   **Editorial Content** (engineering reviews, comparisons,
    recommendations)

-   **Internal Research Notes** (working comments, verification tasks)

Only verified public data should be treated as factual specifications.

**6.19 Success Criteria**

The Master Research Database will be considered production-ready when
it:

-   Supports all 17 equipment categories.

-   Maintains unique identifiers for every record.

-   Eliminates duplicate equipment.

-   Uses standardized units and naming conventions.

-   Allows category-specific technical templates.

-   Exports cleanly to CSV.

-   Can feed HTML, dashboards, and future databases without
    restructuring.

**Chapter Summary**

This chapter defines the core data architecture that powers GDPPE.
Rather than functioning as a simple spreadsheet, the workbook becomes
the authoritative research repository from which every encyclopedia
page, comparison table, dashboard, and future application is generated.
By separating identity, specifications, documentation, relationships,
and validation into linked datasets, the project gains scalability,
maintainability, and long-term reliability.

**Next Chapter**

**Chapter 7 -- Global Research Sources, Documentation Standards &
Information Verification**

This chapter will define:

-   Official information sources

-   Manufacturer documentation hierarchy

-   Brochure and manual collection standards

-   Web research methodology

-   Source citation format

-   Evidence tracking

-   Verification workflow

-   Handling conflicting specifications

-   Copyright and licensing considerations

-   Confidence scoring methodology

This will establish the evidence standards required before any technical
information is accepted into the encyclopedia.

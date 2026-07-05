**GLOBAL DIGITAL PRINT PRODUCTION EQUIPMENT ENCYCLOPEDIA (GDPPE)**

**Master Research & Data Collection Specification**

**Chapter 5 -- Master Equipment Index & Machine Identification
Standards**

**5.1 Purpose**

The **Master Equipment Index (MEI)** is the foundation of the Global
Digital Print Production Equipment Encyclopedia (GDPPE).

Every equipment record, regardless of category, must first exist in the
Master Equipment Index before any technical specifications, manuals,
images, or engineering data are collected.

The Master Equipment Index acts as the **single source of truth** for
all equipment within GDPPE and ensures that:

-   Every machine has a unique identity.

-   Duplicate records are eliminated.

-   Historical models are preserved.

-   Product families remain linked.

-   Future updates are traceable.

-   Knowledge Graph relationships remain consistent.

The Master Equipment Index is not intended to store complete technical
specifications. Its role is to uniquely identify and organize every
commercially significant machine in the digital print production
industry.

**5.2 Objectives**

The Master Equipment Index shall:

-   Identify every commercially significant machine.

-   Record current and discontinued models.

-   Maintain consistent naming conventions.

-   Record parent-child relationships between product families.

-   Support future technical data collection.

-   Serve as the primary lookup table for all encyclopedia modules.

-   Prevent duplicate entries.

-   Support AI, search, reporting, dashboards, and APIs.

**5.3 Equipment Lifecycle**

Every machine shall progress through the following lifecycle.

Research Candidate

↓

Manufacturer Verified

↓

Model Verified

↓

Master Index Created

↓

Engineering Research Started

↓

Technical Validation

↓

Published

↓

Updated

↓

Discontinued

↓

Archived

Historical machines shall never be deleted.

**5.4 Universal Equipment Identifier (UEID)**

Every equipment record shall receive a permanent **Universal Equipment
Identifier (UEID).**

The UEID shall never change, even if the machine is renamed or
discontinued.

**Recommended Format**

GDPPE-Category-Manufacturer-Family-Model-Generation

Example

GDPPE-UV-CANON-ARIZONA-2380-GTF

GDPPE-CUT-ZUND-G3-3XL3200

GDPPE-RIP-CALDERA-V18

GDPPE-PH-RICOH-GEN6

**5.5 Equipment Naming Standard**

Always use the official manufacturer designation.

Correct:

-   Canon Arizona 2380 GTF

-   EFI VUTEk GS3250 LX Pro

-   Zünd G3 3XL-3200

Incorrect:

-   Arizona Printer

-   EFI GS3250

-   Zund Cutter

Never abbreviate official product names.

**5.6 Equipment Hierarchy**

Every machine shall follow the same hierarchy.

Category

↓

Manufacturer

↓

Machine Family

↓

Series

↓

Model

↓

Generation

↓

Configuration

↓

Factory Options

↓

Regional Variants

Example

Printing

↓

UV Flatbed

↓

Canon

↓

Arizona

↓

2300 Series

↓

2380 GTF

↓

High Flow

↓

Roll Option

**5.7 Equipment Categories**

Each machine shall belong to one primary category.

Examples

  -----------------------------------------------------------------------
  **Category**             **Example**
  ------------------------ ----------------------------------------------
  UV Printing              Canon Arizona 2380 GTF

  Digital Cutter           Zünd G3 3XL-3200

  Heat Transfer            Monti Antonio Mod. 180T

  Sewing                   Matic Cronos

  RIP Software             Caldera PrimeCenter

  Printhead                Ricoh Gen6
  -----------------------------------------------------------------------

Secondary categories may be assigned where appropriate.

**5.8 Machine Status**

Each machine shall be assigned one status.

-   Current Production

-   Limited Production

-   Discontinued

-   Legacy

-   Prototype

-   Cancelled

-   Historical

-   Unknown

**5.9 Product Family Rules**

Machines belonging to the same platform shall be grouped into product
families.

Example

Canon

↓

Arizona

↓

2200 Series

↓

2260

↓

2280

↓

2300 Series

↓

2360

↓

2380

This enables family-level comparisons.

**5.10 Generation Identification**

Whenever possible, identify generations.

Examples

Generation I

Generation II

Mark II

Mark III

Gen5

Gen6

Series 2

Series 3

If no official generation exists, leave blank.

Never invent generations.

**5.11 Configuration Management**

Many machines have factory options.

Examples

-   White Ink

-   Varnish

-   Roll Option

-   Dual Roll

-   High Flow

-   Heavy Duty Vacuum

-   Extended Table

-   Automation Package

Configurations shall be recorded separately from the base model.

**5.12 Regional Variants**

Some manufacturers sell the same platform under different names.

Examples

-   Regional branding

-   Different voltage versions

-   Metric / Imperial versions

-   Language editions

Record the variant while linking it to the primary model.

**5.13 OEM Relationships**

Many machines share the same platform.

Record

Original Manufacturer

↓

OEM Platform

↓

Private Label Brand

↓

Regional Distributor

Do not duplicate engineering specifications.

Instead create relationships.

**5.14 Machine Classification Fields**

Every equipment record shall include the following mandatory fields.

**Identity**

-   Universal Equipment ID

-   Category

-   Subcategory

-   Manufacturer

-   Brand

-   Machine Family

-   Product Series

-   Model

-   Generation

-   Configuration

-   OEM Platform

**Business**

-   Country of Origin

-   Country of Manufacture

-   Launch Year

-   Discontinued Year

-   Market Status

-   Product Lifecycle

**Research**

-   Research Status

-   Confidence Level

-   Last Verified

-   Research Completion %

-   Assigned Researcher

**Documentation**

-   Official Website

-   Product Page

-   Brochure

-   Datasheet

-   User Manual

-   Service Manual

-   Parts Manual

**5.15 Excel Master Index Structure**

The Master Equipment Workbook shall contain the following columns.

  -----------------------------------------------------------------------
  **Column**                         **Description**
  ---------------------------------- ------------------------------------
  UEID                               Unique Equipment ID

  Category                           Primary Category

  Subcategory                        Equipment Type

  Manufacturer                       Official Company

  Brand                              Commercial Brand

  Family                             Product Family

  Series                             Product Series

  Model                              Official Model

  Generation                         Product Generation

  Configuration                      Factory Variant

  OEM Platform                       Original Platform

  Country                            Manufacturing Country

  Launch Year                        Year Introduced

  End Year                           Year Discontinued

  Status                             Current / Discontinued

  Official Product URL               Manufacturer Link

  Brochure URL                       Official Brochure

  Research Status                    Current Progress

  Confidence                         High / Medium / Low

  Last Verified                      Verification Date

  Notes                              Research Notes
  -----------------------------------------------------------------------

**5.16 Machine Completeness Index**

Each machine shall receive a completeness score.

  -----------------------------------------------------------------------
  **Area**                                              **Weight**
  ----------------------------------------------------- -----------------
  Identity                                              15%

  Documentation                                         10%

  Images                                                5%

  Technical Specifications                              40%

  Commercial Information                                10%

  Manuals                                               10%

  Media                                                 5%

  Validation                                            5%
  -----------------------------------------------------------------------

Overall Score = 100%

Example

Canon Arizona 2380

Identity

100%

Documentation

100%

Specifications

94%

Manuals

80%

Commercial

70%

Overall

91%

**5.17 Duplicate Detection Rules**

Before adding a machine:

-   Check manufacturer.

-   Check family.

-   Check series.

-   Check model.

-   Check OEM platform.

-   Check discontinued versions.

-   Check regional naming.

If a duplicate exists:

-   Update the existing record.

-   Do not create a second machine.

**5.18 Machine Relationship Model**

Every machine shall be connected to related records.

Example

Canon Arizona 2380

↓

Uses

↓

Printheads

↓

Ricoh Gen5

↓

Compatible RIP

↓

ONYX Thrive

↓

Compatible Ink

↓

Canon UVgel / UV Ink (as applicable to model)

↓

Compatible Media

↓

Acrylic

↓

PVC

↓

Foamboard

↓

Recommended Finishing

↓

Zünd G3

These relationships will later populate the Knowledge Graph.

**5.19 Version Control**

Every modification shall be recorded.

Fields

-   Version

-   Date

-   Modified By

-   Previous Value

-   New Value

-   Reason for Change

This creates a complete audit trail.

**5.20 Master Equipment Register Workflow**

Identify Machine

↓

Verify Manufacturer

↓

Verify Product Family

↓

Verify Model

↓

Assign UEID

↓

Create Master Record

↓

Attach Official Documentation

↓

Mark Research Status

↓

Ready for Technical Research

**5.21 Acceptance Criteria**

A machine shall be considered successfully registered when:

-   Official manufacturer confirmed.

-   Model officially verified.

-   Product family assigned.

-   Category assigned.

-   UEID generated.

-   No duplicate exists.

-   Official product page identified (if available).

-   Initial documentation linked.

-   Research status assigned.

-   Confidence level assigned.

Only then may the machine proceed to detailed engineering research.

**5.22 Chapter Summary**

The Master Equipment Index is the central registry for the entire GDPPE
ecosystem. It establishes a permanent identity for every machine,
standardizes naming and classification, prevents duplication, and
provides the structure required for future technical research,
comparisons, dashboards, APIs, and knowledge graph relationships. By
separating machine identification from technical specification
collection, the encyclopedia gains a robust, scalable foundation capable
of supporting thousands of products across all technology categories.

**Next Chapter**

**Chapter 6 -- Master Research Database Architecture & Excel/CSV
Schema**

Chapter 6 will define:

-   Complete workbook architecture

-   Multi-sheet Excel design

-   CSV import/export standards

-   Folder structure

-   File naming conventions

-   Primary and foreign keys

-   Relationship mapping

-   Data normalization

-   Mandatory vs. optional fields

-   Future SQL/NoSQL compatibility

-   Power BI and API readiness

This chapter will transform the Master Equipment Index into a
production-ready research database that can scale to tens of thousands
of records while remaining maintainable and extensible.

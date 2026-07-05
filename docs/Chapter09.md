**GLOBAL DIGITAL PRINT PRODUCTION EQUIPMENT ENCYCLOPEDIA (GDPPE)**

**Master Research & Data Collection Specification**

**Chapter 9 -- Technical Data Dictionary, Units of Measurement &
Engineering Terminology**

**9.1 Purpose**

The purpose of this chapter is to establish a **Global Engineering Data
Dictionary (GEDD)** for the Global Digital Print Production Equipment
Encyclopedia (GDPPE).

Every technical field, engineering term, unit of measurement, and
calculation used throughout the encyclopedia shall conform to this
standard.

Without a standardized terminology and measurement system, meaningful
comparison between machines from different manufacturers becomes
impossible. Manufacturers frequently use different names for identical
concepts or express the same specification using different units.

This chapter ensures that GDPPE speaks a **single engineering
language**, regardless of manufacturer or technology.

**9.2 Objectives**

The Technical Data Dictionary shall:

-   Standardize engineering terminology.

-   Eliminate ambiguous specifications.

-   Normalize units of measurement.

-   Define accepted abbreviations.

-   Establish controlled vocabularies.

-   Standardize enumerations.

-   Define calculated fields.

-   Support multilingual translation.

-   Enable AI semantic search.

-   Ensure future database compatibility.

**9.3 Engineering Data Types**

Every field shall be assigned a data type.

  ------------------------------------------------------------------------
  **Data Type**   **Description**           **Example**
  --------------- ------------------------- ------------------------------
  Text            Free-form text            Canon Arizona 2380 GTF

  Integer         Whole number              12

  Decimal         Numeric with decimal      3.5

  Boolean         Yes/No                    Yes

  Enumeration     Controlled values         LED UV

  Date            ISO 8601                  2026-07-05

  URL             Web address               Official product page

  Image           Media reference           Hero Image

  Document        PDF reference             Service Manual

  Relationship    Foreign key               Printhead ID
  ------------------------------------------------------------------------

**9.4 Engineering Terminology Standards**

Manufacturers often use different terms for the same concept.

GDPPE shall adopt a single preferred term.

  -----------------------------------------------------------------------
  **Preferred Term**                  **Acceptable Synonyms**
  ----------------------------------- -----------------------------------
  Printhead                           Print Head

  Print Width                         Printable Width

  Media Width                         Material Width

  Working Area                        Bed Size

  Production Speed                    Production Mode Speed

  Maximum Speed                       Draft Speed

  Ink Supply System                   Ink Delivery System

  Vacuum Table                        Vacuum Bed

  Registration Camera                 Vision System

  Motion System                       Drive System

  Servo Motor                         Servo Drive

  UV LED                              LED Curing

  White Ink Recirculation             White Circulation
  -----------------------------------------------------------------------

The preferred term shall always be used in the encyclopedia.

**9.5 Units of Measurement**

GDPPE shall primarily use the **International System of Units (SI)**.

Where industry conventions differ, both units may be displayed.

**Length**

Primary Unit

Millimetre (mm)

Examples

-   Print Width

-   Working Area

-   Media Thickness

Secondary

Metre (m)

**Area**

Square Metre (m²)

Examples

-   Production Output

-   Working Area

**Speed**

Square Metres per Hour (m²/hr)

Alternative

Linear Metres per Minute (m/min)

Use according to machine type.

**Weight**

Kilogram (kg)

Metric Ton (t)

**Pressure**

Bar

kPa

psi (optional)

**Temperature**

Degrees Celsius (°C)

**Power**

Kilowatt (kW)

Watt (W)

**Voltage**

Volt (V)

**Current**

Ampere (A)

**Frequency**

Hertz (Hz)

**Resolution**

Dots per Inch (dpi)

**Ink Drop Size**

Picolitre (pL)

**Humidity**

Relative Humidity (%RH)

**Noise**

Decibel (dB(A))

**Air Flow**

Litres per Minute (L/min)

or

CFM (where appropriate)

**9.6 Unit Conversion Policy**

Raw source values shall be preserved whenever possible.

Example

Official Specification

100 inches

GDPPE

2540 mm

Original Value

100 in

Converted Value

2540 mm

This preserves traceability.

**9.7 Controlled Vocabularies**

Certain fields shall only accept predefined values.

**Machine Status**

-   Current

-   Discontinued

-   Legacy

-   Prototype

-   Cancelled

-   Unknown

**UV Curing**

-   LED

-   Mercury

-   Hybrid

-   UV Gel

-   Not Applicable

**Printhead Technology**

-   Piezoelectric

-   Thermal Inkjet

-   Continuous Inkjet

-   MEMS

-   Electrostatic

-   Not Applicable

**Ink Type**

-   UV

-   Latex

-   Eco-Solvent

-   Solvent

-   Dye Sublimation

-   Reactive

-   Acid

-   Pigment

-   Ceramic

-   Textile Pigment

-   Water-Based

-   UV Gel

**Machine Configuration**

-   Flatbed

-   Hybrid

-   Roll-to-Roll

-   Single Pass

-   Object Printer

-   Cylindrical

-   Conveyor

-   Static Table

**9.8 Engineering Definitions**

**Print Width**

The maximum printable width supported by the machine.

**Media Width**

The maximum material width accepted by the machine.

**Working Area**

The maximum usable cutting, routing, or printing area.

**Production Speed**

Typical production throughput under recommended commercial settings.

**Maximum Speed**

The highest published throughput under draft conditions.

**Registration Accuracy**

The maximum positioning accuracy relative to registration marks.

**Repeatability**

The machine\'s ability to return to the same position repeatedly.

**Native Resolution**

The inherent addressable resolution of the imaging system.

**Maximum Resolution**

The highest advertised print resolution achievable.

**Vacuum Zones**

The number of independently controlled vacuum sections on the working
surface.

**White Ink Recirculation**

A system that continuously circulates white ink to minimize pigment
settling.

**Degassing System**

A system that removes dissolved gases from ink to reduce nozzle
dropouts.

**9.9 Printhead Terminology**

Every printhead record shall define:

-   Manufacturer

-   Model

-   Technology

-   Native Resolution

-   Maximum Resolution

-   Nozzle Count

-   Nozzle Rows

-   Drop Size

-   Variable Drop

-   Firing Frequency

-   Ink Compatibility

-   Compatible Machines

-   Expected Service Life

**9.10 Motion System Terminology**

Define:

-   Servo Motor

-   Linear Motor

-   Rack & Pinion

-   Ball Screw

-   Timing Belt

-   Linear Guide

-   Encoder Resolution

-   Position Accuracy

-   Repeatability

-   Maximum Traverse Speed

**9.11 Color Management Terminology**

Standardize terms such as:

-   ICC Profile

-   Device Link Profile

-   Rendering Intent

-   Spot Color

-   Delta E (ΔE)

-   Spectrophotometer

-   Densitometer

-   Linearization

-   Calibration

-   Profiling

Where applicable, specify the measurement condition (e.g., M0, M1, M2
under ISO 13655).

**9.12 Environmental & Utility Terminology**

Standard fields include:

-   Operating Temperature

-   Storage Temperature

-   Relative Humidity

-   Power Requirement

-   Phase

-   Compressed Air Requirement

-   Exhaust Requirement

-   Chiller Requirement

-   Dust Extraction Requirement

-   Floor Loading

**9.13 Performance Metrics**

Performance metrics shall distinguish between:

  -----------------------------------------------------------------------
  **Metric**             **Definition**
  ---------------------- ------------------------------------------------
  Maximum Speed          Manufacturer\'s highest published throughput

  Production Speed       Typical commercial production throughput

  Quality Speed          Throughput using high-quality print mode

  Recommended Daily      Suggested production capacity
  Volume                 

  Duty Cycle             Maximum designed workload over a defined period
                         (if published)
  -----------------------------------------------------------------------

Editorial estimates shall never replace manufacturer-published values.

**9.14 Missing Data Standards**

The following values shall be used consistently.

  -----------------------------------------------------------------------
  **Status**               **Meaning**
  ------------------------ ----------------------------------------------
  Not Publicly Available   Information not found in public authoritative
                           sources

  Under Verification       Research in progress

  Manufacturer Not         Manufacturer intentionally does not publish
  Disclosed                the value

  Not Applicable           Field does not apply to this technology

  Unknown                  Historical information unavailable
  -----------------------------------------------------------------------

Avoid blank fields for structured data.

**9.15 Abbreviations & Acronyms**

GDPPE shall maintain an approved glossary.

Examples:

  -------------------------------------------------------------------------
  **Acronym**   **Meaning**
  ------------- -----------------------------------------------------------
  UV            Ultraviolet

  LED           Light Emitting Diode

  RIP           Raster Image Processor

  ICC           International Color Consortium

  PLC           Programmable Logic Controller

  HMI           Human-Machine Interface

  VFD           Variable Frequency Drive

  AGV           Automated Guided Vehicle

  ATC           Automatic Tool Changer

  ERP           Enterprise Resource Planning

  API           Application Programming Interface

  JDF           Job Definition Format

  OPC UA        Open Platform Communications Unified Architecture

  ΔE            Delta E Color Difference
  -------------------------------------------------------------------------

**9.16 Data Validation Rules**

Before any technical value is stored:

-   Unit must match the approved standard.

-   Data type must be correct.

-   Enumeration values must match the controlled vocabulary.

-   Numerical values should include units.

-   Converted values should retain the original source value where
    practical.

**9.17 Future Internationalization**

The data dictionary shall support future translation into multiple
languages by:

-   Separating field names from displayed labels.

-   Using controlled vocabularies.

-   Maintaining language-independent identifiers.

-   Avoiding hard-coded text in data fields.

This enables future localization without restructuring the database.

**9.18 Chapter Summary**

The Technical Data Dictionary establishes a common engineering language
for GDPPE. By standardizing terminology, units of measurement,
controlled vocabularies, definitions, and data types, the encyclopedia
can compare equipment from different manufacturers consistently and
accurately. This chapter also lays the groundwork for AI-powered search,
multilingual support, analytics, and future database migrations while
preserving engineering integrity.

**Next Chapter**

**Chapter 10 -- Engineering Data Collection Standards by Equipment
Category**

This chapter will move from terminology to **practical engineering data
collection**. For each of the encyclopedia\'s equipment categories, it
will define:

-   Mandatory engineering fields

-   Optional engineering fields

-   Publicly available vs. typically unpublished parameters

-   Recommended sources for each parameter

-   Measurement standards

-   Validation rules

-   Category-specific completeness scoring

-   Cross-links to related technologies

This chapter will become the operational guide used by researchers when
documenting every machine in the GDPPE.

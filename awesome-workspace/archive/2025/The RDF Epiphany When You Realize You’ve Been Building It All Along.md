# The RDF Epiphany: When You Realize You’ve Been Building It All Along

<!-- image -->

64

1

Listen

Share

<!-- image -->

Part 6 of 6 in the series “LLMs Need Knowledge Graphs. Use RDF or End Up Rebuilding It.”

Previously: We’ve explored RDF’s complete stack — identity (IRIs), structure (triples), semantics (RDFS/OWL), queries (SPARQL), and even compared it to property graphs. Now for the moment of truth.

The Big Picture: Major enterprises are discovering they’ve been rebuilding RDF piece by piece. The smart ones embrace the standards. The rest spend millions learning why the standards exist.

# The Uber Revelation

At the Knowledge Graph Conference in 2019, Joshua Shinavier from Uber stood before an audience and delivered a presentation titled “Building an Enterprise Knowledge Graph @Uber: Lessons from Reality”. With over 200,000 managed datasets and billions of trips served, Uber had every reason to build a knowledge graph.

But their journey revealed uncomfortable truths:

- “RDF is a hard sell” — They couldn’t get internal buy-in for the standard
- “Property Graphs are not enough” — Their chosen alternative hit fundamental limitations
- “Good enough does not scale” — Quick solutions became enterprise bottlenecks

So what did Uber do? They invented an “algebraic property graph” model-essentially rebuilding RDF features on top of property graphs. They needed global identifiers, schema flexibility, and federation capabilities. Sound familiar?

This is the pattern we see repeatedly: resist RDF, build a custom solution, then slowly recreate what RDF already provides. Uber’s presentation wasn’t a success story-it was a cautionary tale.

# The BBC’s Semantic Web Success Story

While Uber was discovering the hard way, the BBC had already learned the lesson. Starting with the 2010 FIFA World Cup, they built their sports coverage on an RDF-based Dynamic Semantic Publishing platform.

The results were dramatic:

- 2010 World Cup: Over 700 automatically generated pages for teams, groups, and players — content volume that “never would have even been considered without the automated Semantic Web approach”
- 2012 Olympics: 10 million page views per day, with pages for 200+ countries and 10,000+ athletes, all generated from their RDF knowledge graph
- Unified content: Transformed from separate sites (Sports, News, Music) into a “coherent service” of interlinked knowledge

Their approach was simple: give every concept (programmes, people, places) a unique URI and build a graph of relationships. Articles were tagged with RDF entity IDs, and inference rules propagated those tags through the graph. The result? More content and more routes to content at lower cost than manual curation.

The BBC didn’t just adopt RDF — they proved it could handle web-scale media delivery while dramatically reducing costs. Their semantic publishing approach became the foundation for the BBC Linked Data Platform, placing linked data at the heart of their digital services. The system has evolved from an experiment to core infrastructure.

# Thomson Reuters: Building a Financial Knowledge Graph

After their merger with Thomson Corporation, Reuters faced a classic enterprise problem: massive data silos. Customer information, financial data, news content — all locked in separate systems with incompatible identifiers.

Their solution? Build PermID, an open linked data system using RDF. In 2017, they launched their Knowledge Graph Feed containing:

- 2 billion relationships connecting financial entities
- Open identifiers (PermID) linking organizations, instruments, and people
- RDF-based architecture using “linked-data principles of the Semantic Web”

They didn’t try to reinvent identity management. They used IRIs. They didn’t create a custom query language. They used SPARQL. They didn’t build proprietary federation protocols. They used RDF’s web architecture. (Note: While the PermID site remains active, the full vision of the Knowledge Graph Feed appears to have evolved since the initial launch.)

# The Architecture of Inevitability

Dan Brickley, who helped create Schema.org at Google, captured the reality perfectly in his foreword to “Validating RDF Data” (co-written with Libby Miller):

“People think RDF is a pain because it is complicated. The truth is even worse. RDF is painfully simplistic, but it allows you to work with real-world data and problems that are horribly complicated.”

This paradox is actually the key to understanding why RDF succeeds where complex systems fail. When you’re dealing with knowledge graphs-integrating data from hundreds of systems, modeling relationships across domains, handling contradictory information from different sources-the last thing you need is a complex architecture. Complex problems require simple, composable primitives.

Consider what happens when you try to solve complex problems with complex architectures:

- Complex + Complex = Chaos: Custom metadata formats, proprietary query languages, and bespoke federation protocols compound the inherent complexity of knowledge representation
- Simple + Complex = Manageable: RDF’s uniform triple structure means the complexity stays in your domain model, not in the infrastructure

The BBC proved this at scale. Their 80% cost savings didn’t come from RDF being sophisticated-it came from RDF being so simple that they could focus on their actual problem: modeling news and sports content. While others were debugging their custom graph databases, BBC was serving 10 million pages per day.

This isn’t unnecessary complexity-it’s necessary architecture. Every enterprise knowledge graph needs:

# 1. Global Identity Management

What You’ll Build: “Entity Resolution Service”, “Canonical ID System”, “Master Data Management” What You’re Actually Building: IRIs

Every system needs globally unique identifiers that work across acquisitions, partners, and systems. You’ll prefix them with your domain. You’ll make them HTTP-resolvable. You’ll handle international characters. Congratulations, you’ve invented IRIs.

# 2. Metadata on Everything

What You’ll Build: “Audit Trail System”, “Data Lineage Tracker”, “Provenance Engine” What You’re Actually Building: RDF* and Named Graphs

That moment when you realize you need to track who said what, when, with what confidence level? That’s when you’ll build a system to attach metadata to statements. RDF* solved this years ago.

# 3. Type Systems and Inference

What You’ll Build: “Business Rule Engine”, “Type Hierarchy Manager”, “Automated Reasoning System” What You’re Actually Building: RDFS and OWL

When your knowledge graph needs to understand that all Engineers are Employees, that location relationships are transitive, that certain properties are symmetric-you’ll build inference. Just like RDFS and OWL already provide.

# 4. Distributed Querying

What You’ll Build: “Federated Query Engine”, “Cross-System Search”, “Unified Data Access Layer” What You’re Actually Building: SPARQL with Federation

The moment you need to query across departmental boundaries, you’ll invent graph patterns, variables, and federation protocols. Your “innovative” query language will converge on SPARQL’s design because the problem space demands it.

# The Cost of Reinvention

Let’s talk numbers. Based on enterprise experiences:

Custom Knowledge Graph Platform:

Adopting RDF Standards:

The BBC saved 80% by adopting RDF. Thomson Reuters cut time-to-insight by up to 90%. Meanwhile, Uber spent years building custom solutions that recreated RDF features-without the interoperability.

# Real Implementation Patterns

Here’s how successful enterprises actually adopt RDF, based on real-world examples:

# Pattern 1: Gradual Migration (The Thomson Reuters Way)

Start with your most painful integration point:

```
# Map existing identifiers to IRIs
<http://permid.org/1-4295884993> a org:Organization ;
    rdfs:label "Thomson Reuters Corp" ;
    owl:sameAs <https://www.wikidata.org/wiki/Q2438151> ;
    org:hasIdentifier [
        a org:Identifier ;
        org:notation "TRI.N" ;
        org:identifierScheme "RIC"
    ] .
```

Thomson Reuters didn’t throw away existing systems. They created a semantic layer on top, gradually migrating capabilities while maintaining backward compatibility.

# Pattern 2: Content Transformation (The BBC Way)

Transform unstructured content into structured knowledge:

```
# BBC's approach - content becomes queryable knowledge
<http://www.bbc.co.uk/sport/olympics/2012/athletes/usain-bolt> 
    a sport:Athlete ;
    sport:competesIn <http://www.bbc.co.uk/sport/olympics/2012/events/100m> ;
    sport:representsCountry <http://www.bbc.co.uk/sport/olympics/countries/jamaica> ;
    foaf:name "Usain Bolt" ;
    sport:medals [ a sport:Gold ; sport:event "100m" ; sport:year 2012 ] .
```

Every piece of content becomes a node in the knowledge graph, richly connected and immediately queryable.

# Pattern 3: Federation First (The Smart Enterprise Way)

Don’t centralize-federate:

```
# Query across your enterprise and external sources
SELECT ?product ?internalRating ?marketPrice WHERE {
    # Your internal data
    ?product a :Product ;
             :internalRating ?internalRating ;
             :manufacturerId ?mfgId .
    
    # External market data
    SERVICE <https://market-data.com/sparql> {
        ?mfgProduct :manufacturerId ?mfgId ;
                    :currentPrice ?marketPrice .
    }
    
    FILTER(?internalRating > 4.0)
}
```

# The LLM Acceleration Factor

Remember why we’re having this conversation: LLMs achieve 3x better accuracy with knowledge graphs than with SQL databases. But this only works if your knowledge graph has:

- Unambiguous identities (IRIs) — So the LLM knows exactly what entity you mean
- Rich semantic context (RDFS/OWL) — So the LLM understands relationships and types
- Federation capabilities (SPARQL) — So the LLM can combine internal and external knowledge
- Traceable provenance (Named Graphs) — So the LLM can explain its reasoning

Every one of these is core to RDF. When you build a knowledge graph for LLM consumption without RDF, you’re setting yourself up to rebuild these features under pressure, probably poorly.

# The Moment of Recognition

It happens to every team that builds a custom knowledge graph:

## Get Bryon Jacob’s stories in your inbox

Join Medium for free to get updates from this writer.

Month 6: “Our entity IDs are colliding after the acquisition. We need globally unique identifiers.” You just discovered IRIs.

Month 12: “We need to track which system asserted each fact and when.” You just discovered Named Graphs.

Month 18: “Our custom query language needs to support federated queries across departments.” You just discovered SPARQL federation.

Month 24: “We need to define what properties mean and how entities relate to each other.” You just discovered RDFS/OWL.

Month 30: “Maybe we should have just used RDF from the start.” You just discovered what many before you have learned.

# Why Simple Scales and Complex Fails

Here’s what Uber, and many others, discovered the hard way:

Property Graphs seem simple too, but they’re missing critical primitives:

- No global identifiers (just local strings)
- No standard semantics (what does “KNOWS” mean exactly?)
- No federation protocol (each vendor has proprietary import/export)
- No unified structure for data and metadata

With RDF’s Complete-but-Simple Architecture:

The difference? Property graphs give you simple storage but leave you to build complex solutions for identity, federation, and semantics. RDF gives you simple primitives that already solve these problems.

The BBC handles millions of sports statistics, news articles, and media assets. They don’t just need to store nodes and edges-they need to know which BBC Sport entity is the same as the Wikipedia entity, track provenance of each fact, and federate queries across news archives. RDF’s “painful simplicity” means these aren’t add-on projects-they’re built in.

This is why Uber ended up building “algebraic property graphs”-they needed RDF’s features but had already committed to a simpler-seeming system that turned out to be incomplete.

# Your Choices, Clearly Stated

After reviewing the evidence from Uber, BBC, Thomson Reuters, and countless other enterprises, your choices are:

# Option 1: Fight the Standards

- Build custom identity schemes (that become IRIs)
- Create proprietary query languages (that converge on SPARQL)
- Invent metadata systems (that mirror RDF*)
- Develop federation protocols (that recreate RDF’s web architecture)
- Spend millions, take years, achieve vendor lock-in

# Option 2: Embrace the Architecture

- Use IRIs for identity (battle-tested since 1998)
- Adopt SPARQL for querying (proven at web scale)
- Leverage RDF* for metadata (emerging standard)
- Build on federation standards (works across organizations)
- Save millions, ship in months, maintain interoperability

# The Path Forward

Here’s how to avoid Uber’s fate and achieve BBC’s success:

# Step 1: Start with Critical Integration Points

Identify where lack of semantic clarity hurts most. Usually:

- Customer data across systems
- Product information from different sources
- Organizational hierarchies and relationships

# Step 2: Create Your First Semantic Layer

Don’t boil the ocean. Pick one domain:

```
@prefix company: <https://data.yourcompany.com/> .
@prefix schema: <https://schema.yourcompany.com/> .

# Start simple - just map existing data to RDF
company:customer-12345 a schema:Customer ;
    schema:customerId "12345" ;
    schema:name "Acme Corp" ;
    owl:sameAs <https://crm.company.com/customers/acme-corp> ,
               <https://erp.company.com/entities/45678> .
```

# Step 3: Demonstrate Value with LLMs

Show the 3x accuracy improvement:

- Before: “Which customers ordered our new product?” → 16% accurate
- After: “Which customers ordered our new product?” → 54% accurate

# Step 4: Expand Gradually

Success breeds adoption. As other teams see the benefits:

- They’ll want their data in the knowledge graph
- They’ll start using RDF patterns even if they don’t call it that
- The network effects compound

# The Inevitable Conclusion

The evidence is overwhelming. From Uber’s struggles to BBC’s success, from Thomson Reuters’s transformation to enterprises worldwide-the pattern is consistent:

Most enterprises eventually build these capabilities:

- Global identity management
- Statement-level metadata
- Semantic type systems
- Distributed querying
- Federation protocols

The only question is: Will you use proven standards that integrate with the world’s knowledge, or spend years rebuilding them in isolation?

The BBC saved 80% by choosing standards. Thomson Reuters achieved 50–90% faster insights. Uber… built their own and presented it as a cautionary tale.

The standards exist not because committees love complexity, but because decades of hard-won experience converged on these solutions. RDF isn’t perfect-it’s just the best we have for knowledge representation at scale.

In our series, we’ve shown you:

1. Why IRIs solve identity universally
2. How triples provide atomic knowledge representation
3. Why RDFS/OWL enable reasoning and inference
4. How SPARQL makes graph querying natural
5. Why even property graphs are adopting RDF features
6. And now, why enterprises inevitably rebuild RDF

For many enterprises, the question becomes not whether to build these capabilities, but whether to learn from others’ experience or develop them independently.

Dan Brickley was right: RDF is painfully simplistic. But your knowledge graph needs aren’t. They’re horribly complicated. And that’s exactly why you need an architecture designed for horrible complexity — a simple, universal, standardized foundation that has proven it can handle the messy reality of enterprise knowledge graphs at scale.

# Key Takeaways

1. Uber tried to avoid RDF, ended up building “algebraic property graphs” with RDF-like features
2. BBC embraced RDF, achieved 80% cost savings and web-scale performance
3. Thomson Reuters adopted RDF, delivered 50–90% faster insights to customers
4. The architecture isn’t optional-you’ll build identity, metadata, inference, and federation regardless
5. The only choice is timing-adopt standards early or rebuild them painfully later

Series conclusion: Every sufficiently advanced knowledge graph converges on RDF’s architecture. Not because RDF is perfect, but because the problems of knowledge representation force these solutions. You’ve now seen why IRIs, triples, RDFS/OWL, SPARQL, and federation form a coherent whole-each piece solving a fundamental challenge that you will face. The enterprises that recognize this pattern early save millions and ship faster. The rest become cautionary tales at conferences. Which will you be?
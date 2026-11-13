// Original FredRock revision questions and model points. Never represent these as
// official exam papers or copies of third-party assessments.
const Q=(question,answer,marks=2)=>({question,answer,marks});

function maths(grade,term){
  const v=term-1;
  if(grade===1)return [Q(`Count on: 5, 6, 7, __, __.`,`8, 9`,2),Q(`Calculate ${4+v} + 3.`,String(7+v)),Q(`Calculate ${9+v} − 4.`,String(5+v)),Q('Name a shape with three sides.','Triangle'),Q('Draw 6 circles and cross out 2. How many remain?','4 circles'),Q('Write the number word for 8.','Eight')];
  if(grade===2)return [Q(`Calculate ${23+v}+15.`,String(38+v)),Q(`Calculate ${54+v}-27.`,String(27+v)),Q('What is half of 18?','9'),Q('Three groups of 4 make how many?','12'),Q('How many minutes are in one hour?','60'),Q('What is the value of the 6 in 368?','60')];
  if(grade===3)return [Q(`Calculate ${246+v}+137.`,String(383+v)),Q('Calculate 7 × 8.','56'),Q('Calculate 48 ÷ 6.','8'),Q('What is one quarter of 28?','7'),Q('A rectangle has sides 6 cm and 3 cm. Find its perimeter.','18 cm'),Q('Write 524 in expanded notation.','500 + 20 + 4')];
  if(grade===4)return [Q(`Calculate ${1426+v}+2587.`,String(4013+v)),Q('Calculate 36 × 7.','252'),Q('Find 3/4 of 28.','21'),Q('What is the next number: 5, 9, 13, 17, __?','21'),Q('A rectangle is 8 cm by 5 cm. Find its perimeter.','26 cm'),Q('Write 6 402 in expanded form.','6 000 + 400 + 2')];
  if(grade===5)return [Q(`Calculate ${13.4+v}+6.25.`,(19.65+v).toFixed(2)),Q('Find 3/5 of 40.','24'),Q('Calculate 864 ÷ 12.','72'),Q('Find the area of a 9 cm × 6 cm rectangle.','54 cm²'),Q('Name an angle greater than 90° but less than 180°.','Obtuse angle'),Q('A sequence increases by 6: 8, 14, 20, __.','26')];
  if(grade===6)return [Q(`Calculate ${2+v}/3 + 1/3.`,`${3+v}/3 (simplify if appropriate)`),Q('Find 25% of R240.','R60'),Q('Calculate 12.5 × 4.','50'),Q('A rectangle is 12 cm by 7 cm. Find its area.','84 cm²'),Q('Simplify 18/24.','3/4'),Q('A pattern doubles: 3, 6, 12, 24, __.','48')];
  if(grade===7)return [Q(`Calculate −8 + ${13+v}.`,String(5+v)),Q('Solve 3x + 5 = 26.','x = 7'),Q('Simplify 4a + 3a − 2a.','5a'),Q('Find 15% of R360.','R54'),Q('A triangle has angles 40° and 65°. Find the third.','75°'),Q('Find the mean of 6, 8, 10 and 12.','9')];
  if(grade===8)return [Q(`Solve 4x − ${5+v} = 19.`,`x = ${(24+v)/4}`),Q('Simplify 2³ × 2².','2⁵ = 32'),Q('Expand 3(x + 4).','3x + 12'),Q('Find the hypotenuse when the legs are 6 cm and 8 cm.','10 cm'),Q('Find the gradient through (1,2) and (3,6).','2'),Q('Factorise 5x + 15.','5(x + 3)')];
  if(grade===9)return [Q('Factorise x² + 7x + 12.','(x + 3)(x + 4)'),Q('Solve 2x + 3 = 17.','x = 7'),Q('Simplify (3a²)(2a³).','6a⁵'),Q('Find y if y = 2x − 5 and x = 6.','7'),Q('Find a missing leg of a right triangle with hypotenuse 13 and other leg 5.','12'),Q('Solve x/4 = 9.','x = 36')];
  if(grade===10)return [Q('Solve x² − 5x + 6 = 0.','x = 2 or x = 3',4),Q('For f(x)=2x²−3, calculate f(4).','29'),Q('Calculate sin 30°.','1/2'),Q('Find the gradient between (−1,2) and (3,10).','2'),Q('Simplify (2x³)(3x²).','6x⁵'),Q('Find 10% simple interest per year on R2 000 for two years.','R400')];
  if(grade===11)return [Q('Solve x² − 9 = 0.','x = −3 or 3',4),Q('Differentiate? At Grade 11, instead find the gradient of y=3x+2.','3'),Q('Simplify (x²)³.','x⁶'),Q('Find cos 60°.','1/2'),Q('Solve 2^(x) = 16.','x = 4'),Q('Find the turning point of y=(x−2)²+1.','(2;1)')];
  return [Q('Differentiate f(x) = 3x² − 4x + 7.','f′(x)=6x−4',4),Q('Find the stationary x-value for f(x)=x²−6x+5.','x = 3',4),Q('Solve x² − 5x + 4 = 0.','x = 1 or 4',4),Q('Calculate P(A ∩ B) if A and B are independent with P(A)=0.4 and P(B)=0.3.','0.12'),Q('Find the gradient of the tangent to y=x³ at x=2.','12'),Q('Evaluate sin²30° + cos²30°.','1')];
}

const BANK={
  'life-skills':[
    Q('Name two ways to stay safe when crossing a road.','Use a pedestrian crossing; look right, left and right again; cross with an adult where appropriate.'),
    Q('Why should we wash our hands before eating?','To remove germs and lower the risk of illness.'),
    Q('Describe one way to show kindness to a classmate.','Share, listen, include others or offer help.'),
    Q('Give two examples of healthy food choices.','Examples: vegetables, fruit, whole grains, milk, water.'),
    Q('Describe a game that helps you move your body.','Any safe physical activity with a clear movement goal.')],
  'nst':[
    Q('What do plants need for healthy growth?','Water, light, air, nutrients and suitable conditions.'),
    Q('Explain the difference between a solid and a liquid.','A solid keeps its own shape; a liquid flows and takes the shape of its container.'),
    Q('Why is an electrical circuit incomplete if its switch is open?','There is a break in the conducting path, so current cannot flow.'),
    Q('Give one example of a technology design that solves a problem.','Examples: a bridge, water filter, wheelchair ramp, solar cooker.'),
    Q('Why is recycling useful?','It conserves resources and reduces waste and pollution.')],
  'natural-sciences':[
    Q('Describe the difference between a producer and a consumer in a food web.','A producer makes its own food; a consumer eats other organisms.'),
    Q('Why must a scientific investigation change only one variable at a time?','To make it easier to identify the cause of the observed change.'),
    Q('Explain the law of conservation of energy in one sentence.','Energy cannot be created or destroyed; it changes form or moves between systems.'),
    Q('Name the three main states of matter.','Solid, liquid, gas.'),
    Q('How can you test whether a material is an electrical conductor?','Put it into a safe low-voltage test circuit and observe whether the bulb lights.')],
  'technology':[
    Q('What is the first step in the design process?','Investigate or identify the problem and requirements.'),
    Q('Why are triangles useful in frame structures?','They are rigid and help resist changes in shape.'),
    Q('Give one example of a mechanical system and explain its use.','Examples: lever for lifting, gear train for transmitting motion, pulley for lifting.'),
    Q('What information belongs in a design specification?','The required function, constraints, user needs and success criteria.'),
    Q('Why must a prototype be tested?','To find weaknesses and see whether it meets the design criteria.')],
  'ems':[
    Q('Explain the difference between a need and a want.','A need is essential for living; a want is desirable but not essential.'),
    Q('What is profit?','Income from sales minus the costs of running the business.'),
    Q('Why is a budget useful?','It plans income and expenses and supports responsible financial decisions.'),
    Q('Give an example of an entrepreneur.','A person who starts and manages a business, accepting risks.'),
    Q('What is the purpose of a receipt?','To provide proof of a transaction and the amount paid.')],
  'geography':[
    Q('What does a map scale tell a reader?','The relationship between map distance and real-world distance.'),
    Q('Name two factors that influence climate.','Latitude, altitude, distance from the sea, ocean currents or relief.'),
    Q('Explain one cause of soil erosion.','Removal of vegetation, overgrazing, water runoff or strong wind.'),
    Q('What is the difference between weather and climate?','Weather is short-term atmospheric conditions; climate is the long-term pattern.'),
    Q('How can communities reduce water waste?','Fix leaks, collect rainwater, use efficient irrigation and reuse safe greywater.')],
  'history':[
    Q('What is a primary historical source?','Evidence created at or close to the time being studied, such as a diary or photograph.'),
    Q('Why do historians compare different sources?','To check reliability, perspective and corroborating evidence.'),
    Q('Explain one way trade can change societies.','Trade spreads goods, technology, ideas and sometimes political influence.'),
    Q('What is chronology?','The arrangement of events in time order.'),
    Q('Why must we consider bias when reading a source?','The creator’s purpose or perspective may affect what is included or omitted.')],
  'life-orientation':[
    Q('Give two strategies for managing examination stress.','Plan study time, sleep well, exercise, ask for support, and practise breathing.'),
    Q('Why is respectful communication important?','It helps prevent conflict and supports healthy relationships.'),
    Q('Explain what informed decision-making involves.','Gather facts, consider options and consequences, then make a reasoned choice.'),
    Q('Give an example of responsible digital citizenship.','Protect personal data, verify claims and treat others respectfully online.'),
    Q('Why should learners explore career requirements early?','It helps them understand subject choices, training and pathways.')],
  'creative-arts':[
    Q('Name two elements of visual art.','Line, shape, form, colour, texture, space or value.'),
    Q('How can rhythm be created in music or dance?','By repeating beats, movements or patterns.'),
    Q('What is a character motivation in drama?','The reason a character acts or speaks as they do.'),
    Q('Explain the difference between warm and cool colours.','Warm colours include red/orange/yellow; cool colours include blue/green/violet.'),
    Q('Why do performers rehearse?','To practise technique, coordination, expression and timing.')],
  'physical-sciences':[
    Q('State Newton’s second law.','The net force equals mass × acceleration: F = ma.',3),
    Q('Calculate the force needed to accelerate 4 kg at 3 m·s⁻².','12 N',3),
    Q('Define an exothermic reaction.','A reaction that releases energy to the surroundings.'),
    Q('What is the SI unit of electrical resistance?','Ohm (Ω).'),
    Q('Balance: H₂ + O₂ → H₂O.','2H₂ + O₂ → 2H₂O',3)],
  'life-sciences':[
    Q('What is the function of mitochondria?','They release usable energy through cellular respiration.'),
    Q('Define photosynthesis.','The process by which green plants use light to make sugars from carbon dioxide and water.'),
    Q('What is an ecosystem?','Organisms interacting with one another and their non-living environment.'),
    Q('Explain the role of DNA in cells.','DNA carries hereditary information used in cell functions and inheritance.'),
    Q('Why is biodiversity important?','It supports ecosystem resilience, resources and ecological processes.')],
  'accounting':[
    Q('State the accounting equation.','Assets = Equity + Liabilities.',3),
    Q('What is a current asset?','An asset expected to be used, sold or converted into cash within the operating cycle.'),
    Q('Explain the purpose of a bank reconciliation.','It identifies and explains differences between business cash records and the bank statement.'),
    Q('Calculate gross profit if sales are R10 000 and cost of sales is R6 500.','R3 500',3),
    Q('Why are source documents important?','They provide evidence for recording transactions.')],
  'business-studies':[
    Q('Explain the difference between a mission and a vision.','Mission describes present purpose; vision describes a desired future.'),
    Q('Name two business environments.','Micro, market, macro.'),
    Q('Why is quality control important?','It helps maintain standards and reduce defects.'),
    Q('What is a SWOT analysis?','An analysis of strengths, weaknesses, opportunities and threats.'),
    Q('Give one ethical business practice.','Honest advertising, fair treatment or responsible sourcing.')],
  'economics':[
    Q('Define scarcity.','Human wants exceed available resources.'),
    Q('What is opportunity cost?','The value of the next-best alternative forgone.'),
    Q('Explain one factor that can shift demand.','Income, tastes, population or prices of related goods.'),
    Q('What is inflation?','A sustained rise in the general price level.'),
    Q('Name a role of the Reserve Bank.','Supporting price stability through monetary policy.')],
  'cat':[
    Q('What is the purpose of a spreadsheet formula?','To calculate a result from values and cell references.'),
    Q('Explain the difference between RAM and storage.','RAM is temporary working memory; storage holds data persistently.'),
    Q('Why should you use strong unique passwords?','To reduce the risk that one compromised account exposes others.'),
    Q('What is a database query?','A request to retrieve or manipulate specified data.'),
    Q('Give one way to evaluate the credibility of a website.','Check the author, evidence, date, purpose and independent corroboration.')],
  'it':[
    Q('Explain the difference between a variable and a constant.','A variable may change; a constant retains a fixed value.'),
    Q('What is an algorithm?','A finite sequence of clear steps for solving a problem.'),
    Q('What is a primary key in a relational database?','A field or combination that uniquely identifies each record.'),
    Q('What does a loop do?','Repeats instructions while a condition or count controls repetition.'),
    Q('Why are input validation checks important?','They prevent invalid or unsafe values from being processed.')],
  'tourism':[
    Q('Name two factors tourists consider when selecting a destination.','Cost, safety, accessibility, attractions, climate or culture.'),
    Q('Explain sustainable tourism.','Tourism that considers environmental, cultural and economic impacts over time.'),
    Q('Why is customer service important in tourism?','It builds satisfaction, trust and repeat business.'),
    Q('What is an itinerary?','A planned schedule of travel activities, transport and accommodation.'),
    Q('Give one example of a heritage attraction.','A museum, historic site, cultural landscape or monument.')],
  'consumer-studies':[
    Q('What is a consumer right?','An entitlement such as safety, information or fair treatment.'),
    Q('Why is a balanced diet important?','It supplies nutrients needed for growth and health.'),
    Q('What is an ingredient label used for?','To understand product contents and make informed choices.'),
    Q('Explain one way to reduce household food waste.','Plan meals, store food correctly or use leftovers safely.'),
    Q('What is the difference between a need and a want?','Needs are essential; wants are optional preferences.')],
  'agricultural-sciences':[
    Q('Name two factors influencing crop growth.','Water, light, soil nutrients, temperature or pests.'),
    Q('Explain crop rotation.','Growing different crops in sequence to support soil health and manage pests.'),
    Q('Why is soil structure important?','It affects water movement, aeration and root development.'),
    Q('What is sustainable agriculture?','Producing food while protecting resources for future generations.'),
    Q('Give one method of preventing soil erosion.','Contour farming, cover crops or reduced overgrazing.')],
  'egd':[
    Q('What is an orthographic projection?','A set of 2-D views showing an object accurately from different directions.'),
    Q('Why are dimensions essential on working drawings?','They communicate the sizes needed to make or check an object.'),
    Q('What is a centre line used for?','To show axes of symmetry or circular features.'),
    Q('Explain the purpose of a scale on a technical drawing.','To represent an object at a proportional size.'),
    Q('What is an isometric drawing?','A 3-D pictorial representation with three principal axes.')],
  'visual-arts':[
    Q('Name two principles of design.','Balance, contrast, emphasis, movement, pattern, rhythm or unity.'),
    Q('What is the role of context in interpreting artwork?','It helps explain the artist’s social, historical or cultural circumstances.'),
    Q('Explain visual symbolism.','Using objects, shapes or colours to communicate meanings beyond their literal appearance.'),
    Q('What is composition?','How visual elements are arranged within an artwork.'),
    Q('Why should artists document their process?','To show research, development, decisions and reflection.')],
  'dramatic-arts':[
    Q('What is a dramatic conflict?','The struggle between opposing goals or forces that drives the action.'),
    Q('How can an actor use voice to communicate character?','Through pace, volume, pitch, tone and articulation.'),
    Q('Define stage directions.','Instructions indicating movement, action or production details.'),
    Q('What is the purpose of a rehearsal?','To develop performance, timing and collaboration.'),
    Q('Why is an audience important in theatre?','Performance meaning is interpreted through live audience engagement.')]
};

function mathLit(grade){const price=1500+(grade-10)*500;return [
  Q(`A laptop costs R${price}. A shop offers a 10% discount. What is the sale price?`,`R${(price*.9).toFixed(2)}`,4),
  Q('A recipe for four people uses 300 g flour. How much for six people?','450 g'),
  Q('A journey is 180 km and takes three hours. Find average speed.','60 km/h'),
  Q('Convert 2.5 litres to millilitres.','2 500 mL'),
  Q('A monthly budget has R6 000 income and R4 850 expenses. Find the balance.','R1 150')];}

function languagePractice(grade,subject){
  const name=subject.name;
  if(grade<=3){return [
    Q(`Write three words naming things you see at school in ${name}.`,'Any three correctly used school-related words; spelling and meaning considered.',3),
    Q(`Write one sentence about your family in ${name}.`,'A complete meaningful sentence with appropriate word order and punctuation.',3),
    Q('Identify the beginning sound in the word “sun”.','/s/ (for English; use a matching example in the selected language).'),
    Q('Read a short story and name its main character.','Name a character from the story and give supporting evidence.'),
    Q(`Write a greeting in ${name}.`,'An appropriate greeting in the chosen language.')];}
  if(grade<=6){return [
    Q(`Write a paragraph (5–6 sentences) about protecting the environment in ${name}.`,'Clear topic sentence, logical ideas, appropriate vocabulary, spelling and punctuation.',6),
    Q('State two details that help a reader identify a text’s main idea.','Title, repeated ideas, topic sentences and supporting details.'),
    Q('Explain the difference between a fact and an opinion.','A fact can be checked; an opinion expresses a view.'),
    Q(`Create two questions for an interview in ${name}.`,'Two relevant, grammatically appropriate interrogative sentences.'),
    Q('Identify one figurative language technique from a poem.','A valid example such as simile, metaphor or personification, with explanation.')];}
  return [
    Q(`Write an argumentative paragraph on responsible smartphone use in ${name}.`,'Position, supporting reasons, coherent structure and appropriate language register.',8),
    Q('How does tone influence the meaning of a passage?','Tone reveals the writer’s attitude and guides interpretation, supported by words and context.'),
    Q('Explain the difference between denotation and connotation.','Denotation is literal meaning; connotation is associated meaning.'),
    Q(`Draft a professional email requesting information in ${name}.`,'Suitable subject line, greeting, purpose, polite register and closing.',8),
    Q('Explain how a visual text can persuade its audience.','Through design, imagery, language, contrast, colour, layout and appeal.')];
}

export function practiceFor(grade,subject,term=1){
  let questions=subject.id==='mathematics'?maths(grade,term):subject.id==='math-lit'?mathLit(grade):subject.type==='language'?languagePractice(grade,subject):(BANK[subject.id]||BANK['life-orientation']);
  // Rotate a curated set of original questions for each term without inventing past-paper labels.
  const shift=(Number(term)-1)%questions.length;
  questions=[...questions.slice(shift),...questions.slice(0,shift)].slice(0,5);
  return {questions,totalMarks:questions.reduce((sum,q)=>sum+q.marks,0),disclaimer:'Original FredRock practice questions. Not an official examination or a reproduction of a past paper.'};
}

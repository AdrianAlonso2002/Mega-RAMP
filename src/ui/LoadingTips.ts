/** Short, locally bundled text: no requests or timers during the three-second loading screen. */
export const SKIN_LOADING_TIP='Consigue el 80 % de los coleccionables de un mundo para desbloquear una nueva skin de personaje.';
export const GENERIC_LOADING_TIP='Cada curva es una nueva oportunidad. Ajusta tu velocidad y disfruta del recorrido.';

export const WORLD_CURIOSITIES:Readonly<Record<number,readonly string[]>>={
 1:[
  'Villamanta pertenece a la Comunidad de Madrid y forma parte del paisaje rural de su Sierra Oeste.',
  'La iglesia de Santa Catalina se levanta sobre una zona elevada del casco histórico de Villamanta.',
  'En los edificios históricos de Villamanta se combinan materiales como la piedra, el ladrillo y la madera.',
  'El ayuntamiento de Villamanta tiene una galería abierta a la plaza, con columnas y un balcón corrido.',
  'La fachada del ayuntamiento de Villamanta adquirió su imagen característica en una reforma de 1930.'
 ],
 2:[
  'La playa de San Juan forma parte de la costa mediterránea de Alicante.',
  'La Explanada de España es conocida por su mosaico de ondas, que recuerda al movimiento del mar.',
  'El castillo de Santa Bárbara se alza sobre el monte Benacantil, por encima de Alicante.',
  'En la costa de Alicante conviven playas de arena, pequeñas calas y paseos junto al mar.',
  'El TRAM conecta Alicante con la zona de la playa de San Juan.'
 ],
 3:[
  'Las Hurdes se encuentran en el norte de la provincia de Cáceres, en Extremadura.',
  'En Las Hurdes se llama alquerías a muchas de sus pequeñas localidades.',
  'La piedra y la pizarra forman parte de la arquitectura tradicional hurdana.',
  'Los ríos de Las Hurdes dibujan valles, pozas y cascadas entre las montañas.',
  'El sendero GR 10 atraviesa localidades hurdanas como Mesegal, Pinofranqueado y Ovejuela.'
 ],
 4:[
  'Carabanchel fue, antes de incorporarse a Madrid, dos municipios: Carabanchel Alto y Carabanchel Bajo.',
  'Carabanchel es un distrito del sur de Madrid con parques, comercios y una larga vida de barrio.',
  'El parque de Las Cruces se extiende entre los distritos de Latina y Carabanchel.',
  'La línea 5 de Metro pasa por estaciones de Carabanchel como Vista Alegre y Oporto.',
  'La Pradera de San Isidro es uno de los espacios más conocidos de las celebraciones madrileñas.'
 ],
 5:[
  'Asturias reúne costa cantábrica, valles verdes y altas montañas en un mismo territorio.',
  'Los Picos de Europa se extienden por Asturias, Cantabria y León.',
  'Los hórreos elevan su espacio de almacenamiento sobre apoyos para proteger lo que guardan.',
  'El Sella une paisajes de montaña con la costa de Ribadesella.',
  'El parque nacional de la Montaña de Covadonga, creado en 1918, fue el origen del actual Picos de Europa.'
 ],
 6:[
  'Big Ben es el nombre de la gran campana: la torre se llama Elizabeth Tower.',
  'El Támesis atraviesa Londres y pasa junto al Palacio de Westminster.',
  'El Underground londinense también se conoce como The Tube por la forma de sus túneles.',
  'Los autobuses rojos de dos pisos son una de las imágenes más reconocibles de Londres.',
  'Los parques londinenses esconden jardines, quioscos de música y pequeños rincones tranquilos entre las calles.'
 ],
 7:[
  'La palabra sakura se utiliza en Japón para hablar de los cerezos y de sus flores.',
  'Un torii señala la entrada a un espacio sagrado de la tradición sintoísta.',
  'Kioto, Nara y Osaka pertenecen a la región japonesa de Kansai.',
  'El monte Fuji es un volcán y uno de los grandes símbolos del paisaje japonés.',
  'El hanami consiste en disfrutar de las flores, especialmente durante la floración de los cerezos.'
 ],
 8:[
  'Muchos fiordos noruegos son antiguos valles excavados por glaciares y después inundados por el mar.',
  'Las auroras aparecen cuando partículas solares interactúan con los gases de la alta atmósfera.',
  'En el norte de Noruega puede verse el sol de medianoche durante parte del verano.',
  'Noruega combina fiordos, glaciares, montañas y pequeñas poblaciones junto al agua.',
  'Las auroras pueden dibujar cortinas verdes, azules, rosadas y violetas en el cielo.'
 ]
};

/** Only real-place facts, sourced externally or supplied by the owner; incomplete places stay incomplete. */
export const LEVEL_CURIOSITIES:Readonly<Record<string,readonly string[]>>={
 '1_1':[
  'Calle Río Tajo es una calle tranquila de Villamanta.',
  'En Calle Río Tajo es habitual ver gorriones.',
  'Durante las fiestas, los toros pasan por Calle Río Tajo.',
  'La plaza de toros de Villamanta está cerca de Calle Río Tajo.',
  'El Arroyo Grande pasa cerca de Calle Río Tajo.'
 ],
 '1_2':[
  'Santa Catalina de Alejandría, en Villamanta, se construyó entre los siglos XVI y XVII.',
  'La parroquia de Santa Catalina tiene tres naves de la misma altura.',
  'En sus muros se alternan piedra y ladrillo mediante el llamado aparejo toledano.',
  'La nave central de Santa Catalina conserva una cubierta de madera vista.',
  'En el atrio de la iglesia hay un crucero de granito del siglo XVII.'
 ],
 '1_3':[
  'A su lado se pone las ferias del pueblo',
  'El polideportivo de Villamanta fue arrasado por la DANA.',
  'El polideportivo de Villamanta tiene un chiringuito.',
  'El polideportivo cuenta con un campo de fútbol nuevo.',
  'En el polideportivo de Villamanta se puede jugar al pádel.'
 ],
 '1_4':[
  'La plaza de Villamanta reúne la sede del ayuntamiento y su galería porticada.',
  'La galería del ayuntamiento utiliza columnas de fundición y sostiene un balcón corrido de hierro.',
  'El ayuntamiento ha tenido uso municipal desde, al menos, el siglo XVII.',
  'La fachada municipal combina paredes encaladas y un zócalo de granito.',
  'El reloj y el campanario forman parte de la imagen del ayuntamiento que mira hacia la plaza.'
 ],
 '2_1':[
  'El apartamento está en una novena planta.',
  'El apartamento se encuentra en la calle Arpón.',
  'El apartamento está en la zona de San Juan, en Alicante.',
  'En el apartamento hay una piscina y pista de tenis.',
  'En el apartamento se duerme con el colchón en el suelo.'
 ],
 '2_2':[
  'La Explanada de Alicante utiliza un mosaico de formas onduladas inspirado en las olas.',
  'El castillo de Santa Bárbara domina Alicante desde el monte Benacantil.',
  'El puerto y el paseo marítimo acercan el centro de Alicante al Mediterráneo.',
  'La playa del Postiguet se encuentra junto al centro urbano de Alicante.',
  'Las palmeras de la Explanada acompañan uno de los paseos más reconocibles de la ciudad.'
 ],
 '2_3':[
  'La playa de San Juan es una extensa playa de arena del litoral alicantino.',
  'Su paseo marítimo acompaña la playa y conecta zonas de descanso, terrazas y accesos al mar.',
  'La playa de San Juan está conectada con Alicante mediante el TRAM.',
  'Las olas transportan arena y modifican poco a poco la forma de una playa.',
  'En la playa de San Juan hay zonas para practicar deportes junto al mar.'
 ],
 '2_4':[
  'La Fontana es un mercado de San Juan.',
  'En La Fontana se encuentra la pizzería Popeyes.',
  'Entre los comercios de La Fontana hay un bazar.',
  'La Fontana reúne numerosas tiendas de ropa.',
  'La Fontana es un lugar antiguo y muy conocido en San Juan.'
 ],
 '3_1':[
  'La casina está entre las callejuelas de Mesegal.',
  'La casina es muy pequeñina.',
  'Por fuera de La casina es habitual encontrarse perros y gatos.',
  'En La casina hace frío en invierno y calor en verano.',
  'En el entorno de La casina hay muchas salamandras.'
 ],
 '3_2':[
  'La Era se encuentra en Mesegal.',
  'En La Era se celebra la Carbochá.',
  'La Era es un lugar muy antiguo de Mesegal.',
  'La Era está rodeada de piedras.',
  'Las castañas asadas son protagonistas de la Carbochá.'
 ],
 '3_3':[
  'Pinofranqueado es uno de los municipios de Las Hurdes, en el norte de Cáceres.',
  'Ovejuela pertenece al municipio de Pinofranqueado.',
  'El río de los Ángeles atraviesa el entorno de Pinofranqueado.',
  'El GR 10 pasa por Pinofranqueado en su recorrido por Las Hurdes.',
  'Pinofranqueado y sus alquerías se reparten entre los valles montañosos de Las Hurdes.'
 ],
 '3_4':[
  'El Chorrituelo de Ovejuela es una cascada situada en el entorno de Las Hurdes.',
  'La ruta al Chorrituelo combina el cauce del río con un paisaje de roca y vegetación.',
  'Una cascada cambia de aspecto según la cantidad de agua que transporta el río.',
  'Las pozas se forman donde la corriente y la caída del agua van modelando la roca.',
  'Ovejuela es una alquería del municipio de Pinofranqueado.'
 ],
 '4_1':[
  'Piqueñas es una calle larga.',
  'En Piqueñas hay un pinar.',
  'Adri y Misi viven en la calle Piqueñas.',
  'En la zona baja de Piqueñas hay un supermercado DIA.',
  'Los Litos también viven en Piqueñas.'
 ],
 '4_2':[
  'Rony vive en la calle San Melitón.',
  'Pao también vive en la calle San Melitón.',
  'En San Melitón vive una comunidad gitana.',
  'En San Melitón también vive un aficionado del Real Madrid.',
  'Maléfica también vive en San Melitón.'
 ],
 '4_3':[
  'El parque de Las Cruces se encuentra entre los distritos madrileños de Latina y Carabanchel.',
  'Su nombre recuerda al antiguo camino que llevaba al cementerio de Las Cruces.',
  'El parque combina zonas de carácter forestal con paseos, césped y espacios más urbanos.',
  'Las Cruces se construyó sobre terrenos que anteriormente tuvieron uso agrícola.',
  'Las Cruces cuenta con zonas para pasear y practicar deporte.'
 ],
 '4_4':[
  'Islazul es un centro comercial de Madrid situado en el distrito de Carabanchel.',
  'La gran cubierta transparente de Islazul utiliza un material llamado ETFE.',
  'Parte de su cubierta está formada por cojines inflados de aire sobre una estructura ligera.',
  'El proyecto arquitectónico de Islazul fue desarrollado por L35 Arquitectos.',
  'La cubierta transparente deja entrar luz natural en el interior del centro comercial.'
 ],
 '5_1':[
  'Oviedo es la capital de Asturias y conserva un casco histórico de calles y plazas.',
  'La catedral de Oviedo está dedicada a San Salvador.',
  'Las esculturas al aire libre forman parte del paisaje urbano de Oviedo.',
  'En el Campo San Francisco de Oviedo hay una escultura de Mafalda sentada en un banco.',
  'El Campo San Francisco es uno de los parques del centro de Oviedo.'
 ],
 '5_2':[
  'El famoso Puente Romano de Cangas de Onís es, en su construcción conservada, de época medieval.',
  'Del arco principal del puente de Cangas de Onís cuelga una representación de la Cruz de la Victoria.',
  'Cangas de Onís es una de las puertas de entrada al entorno de Covadonga y los Picos de Europa.',
  'El río Sella pasa bajo el puente más conocido de Cangas de Onís.',
  'El puente de Cangas de Onís tiene un gran arco central de perfil apuntado.'
 ],
 '5_3':[
  'El Descenso Internacional del Sella recorre el río entre Arriondas y Ribadesella.',
  'Ribadesella se encuentra junto a la desembocadura del Sella en el mar Cantábrico.',
  'La tradición del Descenso del Sella se remonta a 1930.',
  'La prueba del Sella adquirió carácter internacional en 1951.',
  'El paisaje fluvial del Sella combina agua, vegetación de ribera y montañas.'
 ],
 '5_4':[
  'Enol y La Ercina son los dos lagos más conocidos del conjunto de los Lagos de Covadonga.',
  'Los Lagos de Covadonga se encuentran dentro del Parque Nacional de los Picos de Europa.',
  'La basílica de Covadonga, inaugurada en 1901, es de estilo neorrománico.',
  'La Santa Cueva y la basílica son dos espacios distintos del santuario de Covadonga.',
  'Los lagos, las praderas y la roca caliza dan al paisaje de Covadonga su aspecto característico.'
 ],
 '6_1':[
  'Queen’s Park es un espacio verde londinense con jardines y zonas de juego.',
  'El parque tiene un quiosco de música, una pequeña granja y pistas de tenis.',
  'Queen’s Park está conectado con el transporte ferroviario de Londres mediante estaciones cercanas.',
  'Los jardines ornamentales del parque ofrecen un contraste tranquilo con las calles del entorno.',
  'El quiosco de música de Queen’s Park se construyó en 1891.'
 ],
 '6_2':[
  'El British Museum y el Natural History Museum son museos distintos de Londres.',
  'La gran sala central del British Museum se organiza alrededor de su antigua sala de lectura.',
  'La Piedra de Rosetta fue fundamental para comprender la escritura jeroglífica egipcia.',
  'Los fósiles ayudan a reconstruir cómo eran animales que vivieron mucho antes que los seres humanos.',
  'La sala de lectura circular del British Museum abrió en 1857.'
 ],
 '6_3':[
  'La Radcliffe Camera es una biblioteca de Oxford, no una cámara fotográfica.',
  'El nombre Camera procede del latín y significa habitación o sala.',
  'La Radcliffe Camera está conectada con la biblioteca Bodleiana mediante un paso subterráneo.',
  'La Universidad de Oxford combina colleges con departamentos dedicados a las distintas materias.',
  'Oxford es una ciudad universitaria distinta de Londres.'
 ],
 '6_4':[
  'La Elizabeth Tower forma parte del Palacio de Westminster, junto al río Támesis.',
  'Big Ben es la gran campana que marca las horas, aunque el nombre se use también para hablar de la torre.',
  'La torre del reloj tiene aproximadamente 96 metros de altura.',
  'El mecanismo del reloj y el espacio de las campanas ocupan zonas distintas dentro de la torre.',
  'El reloj de Westminster tiene cuatro grandes esferas, una en cada lado de la torre.'
 ],
 '7_1':[
  'Kioto fue capital de Japón antes de que la corte se trasladara a Tokio.',
  'El santuario Fushimi Inari es conocido por sus largos caminos de puertas torii.',
  'Arashiyama, en Kioto, es famoso por su paisaje de bambú.',
  'Un templo budista y un santuario sintoísta pertenecen a tradiciones religiosas diferentes.',
  'Los distritos de Arashiyama y Sagano se encuentran en la zona oeste de Kioto.'
 ],
 '7_2':[
  'Nara fue capital de Japón antes de Kioto.',
  'El parque de Nara es conocido por los ciervos que recorren sus zonas verdes.',
  'El templo Tōdai-ji alberga una gran imagen de Buda.',
  'El santuario Kasuga Taisha es conocido por sus numerosas linternas.',
  'Los ciervos forman parte de la identidad cultural y del paisaje de Nara.'
 ],
 '7_3':[
  'Osaka es una de las grandes ciudades de la región de Kansai.',
  'Dōtonbori es conocido por su canal y sus grandes letreros luminosos.',
  'El castillo de Osaka se encuentra rodeado de murallas y fosos.',
  'El takoyaki es una especialidad asociada a Osaka, elaborada en pequeñas bolas de masa.',
  'Dōtonbori se desarrolló junto a un canal artificial construido en el siglo XVII.'
 ],
 '7_4':[
  'Tokio se llamó Edo antes de convertirse en la capital moderna de Japón.',
  'El cruce de Shibuya permite que los peatones atraviesen la intersección en varias direcciones a la vez.',
  'La Torre de Tokio combina una estructura metálica con sus característicos colores claros y anaranjados.',
  'Tokio reúne santuarios tradicionales y grandes edificios contemporáneos en una misma ciudad.',
  'En días despejados, el monte Fuji puede verse desde algunos miradores de Tokio.'
 ],
 '8_1':[
  'Los glaciares han contribuido a modelar muchas de las montañas y los valles de Noruega.',
  'En la alta montaña, la vegetación cambia con la altura y las condiciones del clima.',
  'Las crestas separan laderas y valles, formando líneas muy reconocibles en el horizonte.',
  'El deshielo alimenta ríos y cascadas durante la época más cálida.',
  'La montaña más alta de Noruega, Galdhøpiggen, se encuentra en Jotunheimen.'
 ],
 '8_2':[
  'Un fiordo es una entrada de mar que ocupa un valle modelado por el hielo.',
  'Las paredes de un fiordo pueden elevarse de forma muy pronunciada junto al agua.',
  'El Sognefjord es uno de los fiordos más conocidos de Noruega.',
  'Las cabañas rorbu están ligadas a la tradición pesquera del norte noruego.',
  'Los fiordos pueden recorrerse en barco o en kayak, con las montañas a ambos lados.'
 ],
 '8_3':[
  'Oslo es la capital de Noruega y se encuentra junto al Oslofjord.',
  'La cubierta de la Ópera de Oslo está diseñada como una superficie por la que se puede caminar.',
  'Holmenkollen es uno de los lugares más conocidos de Oslo relacionados con el salto de esquí.',
  'El parque de Vigeland reúne esculturas al aire libre dentro del parque Frogner.',
  'Oslo combina espacios urbanos con bosques y zonas naturales cercanas.'
 ],
 '8_4':[
  'Las auroras se producen a gran altura, muy por encima de las nubes habituales.',
  'Los gases de la atmósfera influyen en los colores que aparecen en una aurora.',
  'Las luces de las ciudades dificultan ver las auroras más débiles.',
  'Una aurora puede parecer una cortina que cambia de forma lentamente sobre el horizonte.',
  'La oscuridad del invierno del norte ofrece un fondo adecuado para observar las luces boreales.'
 ]
};

export function getLoadingTips(world:number,level:number):readonly string[]{
 return [...(WORLD_CURIOSITIES[world]??[]),...(LEVEL_CURIOSITIES[`${world}_${level}`]??[]),SKIN_LOADING_TIP,GENERIC_LOADING_TIP];
}

/** Visit every message before reshuffling, without repeating the last one at a bag boundary. */
export class LoadingTipPicker {
 private readonly bags=new Map<string,string[]>();
 private last='';
 constructor(private readonly random=()=>Math.random()){}
 next(world:number,level:number):string {
  const key=`${world}_${level}`;let bag=this.bags.get(key);
  if(!bag?.length){
   bag=[...getLoadingTips(world,level)];
   for(let i=bag.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];}
   if(bag.length>1&&bag.at(-1)===this.last)[bag[0],bag[bag.length-1]]=[bag[bag.length-1],bag[0]];
   this.bags.set(key,bag);
  }
  return this.last=bag.pop()!;
 }
}

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      

    {/*  1. NAVBAR  */}
    <nav className="fixed w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-24">
                <div className="flex-shrink-0">
                    <a href="#" className="flex items-center"><img src="/assets/logo.png" alt="MB Consultech Logo" className="h-12 md:h-16 w-auto py-2" /></a>
                </div>
                {/*  Desktop Menu  */}
                <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-8">
                        <a href="#pain-points" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Chi Siamo</a>
                        <a href="#servizi" className="hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Servizi</a>
                        {/*  FLAG_NODOCLIMA: Rimuovere la classe 'hidden' qui sotto per mostrare il link  */}
                        <a href="#nodoclima" className="hidden hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">NodoClima</a>
                        <a href="#checkup" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(5,150,105,0.3)]">Prenota un Check-up</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    {/*  2. HERO SECTION  */}
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/*  Abstract gradient background  */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight mb-8">
                L'anello di congiunzione tra <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">Efficienza Energetica</span> e <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">Automazione Digitale.</span>
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-zinc-400 leading-relaxed mb-10">
                Riduci il rischio tecnologico nelle commesse HVAC/BMS complesse. Fornisco studi di fattibilità, architetture logiche e diagnostica remota basati su 30 anni di esperienza sul campo. <br />
                <strong className="text-zinc-200 mt-2 block">Senza rimpalli di responsabilità.</strong>
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="#checkup" className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-lg transition-all shadow-[0_0_20px_rgba(5,150,105,0.4)] hover:shadow-[0_0_30px_rgba(5,150,105,0.6)]">Richiedi un Check-up Tecnico</a>
                <a href="#servizi" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-700 hover:border-emerald-500 hover:text-emerald-400 text-zinc-300 rounded-lg font-semibold text-lg transition-all">Scopri i Servizi</a>
            </div>
        </div>
    </section>

    {/*  3. PAIN POINTS SECTION  */}
    <section id="pain-points" className="py-24 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Perché ti serve un Advisor indipendente?</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Il gap tra progettazione meccanica e integrazione software è dove si perdono i margini di commessa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/*  Studi  */}
                <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Studi di Progettazione</h3>
                    <p className="text-zinc-400 leading-relaxed">"Progetti termotecnici perfetti sulla carta, ma difficili da integrare lato automazione."</p>
                </div>
                {/*  General Contractor  */}
                <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-colors group md:-translate-y-4">
                    <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">General Contractor</h3>
                    <p className="text-zinc-400 leading-relaxed">"Varianti in corso d'opera e rimpalli di responsabilità continui tra idraulico ed elettricista in cantiere."</p>
                </div>
                {/*  Installatori  */}
                <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 hover:border-emerald-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-emerald-900/30 rounded-lg flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Aziende di Installazione</h3>
                    <p className="text-zinc-400 leading-relaxed">"Paura di perdere commesse evolute (BMS, Smart Building) per mancanza di competenze software interne."</p>
                </div>
            </div>
        </div>
    </section>

    {/*  4. SERVIZI (Prodotti a Pacchetto)  */}
    <section id="servizi" className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Soluzioni Tecniche su Misura</h2>
                <p className="text-zinc-400 text-lg">I miei servizi sono chiari e pacchettizzati per offrirti certezze di costi e tempi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="border-l-2 border-emerald-500 pl-6 py-2">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-4 border border-zinc-800">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Architetture di Rete & Protocolli</h3>
                    <p className="text-zinc-400 leading-relaxed">Ingegnerizzazione dei flussi dati e validazione dell'architettura (BACnet, Modbus, KNX) per garantire l'interoperabilità e prevenire colli di bottiglia prima del cantiere.</p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-6 py-2">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-4 border border-zinc-800">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H9a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 9 19.5Z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Revisione Logiche e Sequenze di Funzionamento</h3>
                    <p className="text-zinc-400 leading-relaxed">Analisi a tavolino dei diagrammi P&I e degli algoritmi di regolazione, ottimizzando il software per prevenire inefficienze e pendolamenti delle valvole in fase di test.</p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-6 py-2">
                    <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-4 border border-zinc-800">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Technical Advisory per General Contractor</h3>
                    <p className="text-zinc-400 leading-relaxed">Validazione tecnica delle offerte dei subappaltatori in fase di gara per azzerare i buchi di fornitura tra idraulico ed elettrico.</p>
                </div>
            </div>
        </div>
    </section>

    {/*  5. PRODOTTO D'INGRESSO (Box Check-up)  */}
    <section id="checkup" className="py-16 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-zinc-900 rounded-3xl border border-zinc-700 overflow-hidden relative shadow-2xl">
                {/*  Decorative element  */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="p-8 md:p-12 relative z-10">
                    <span className="inline-block px-3 py-1 bg-emerald-900/50 text-emerald-400 font-semibold text-xs tracking-wider uppercase rounded-full mb-6 border border-emerald-800">Servizio In Evidenza</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">HVAC/BMS Architecture Check-up</h2>
                    
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <p className="text-zinc-300 text-lg mb-6 leading-relaxed">
                                Evita varianti e ritardi. Analizzo la documentazione di progetto e individuo i colli di bottiglia hardware e software prima che il cantiere abbia inizio.
                            </p>
                            <ul className="space-y-4 text-zinc-400">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>Invio dei PDF di progetto (schemi idraulici, specifiche).</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>Analisi profonda di compatibilità protocolli e algoritmi.</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    <span>Consegna di un <strong className="text-white">report diagnostico di 4 pagine</strong> con le criticità evidenziate.</span>
                                </li>
                            </ul>
                            
                            <div className="mt-10">
                                <a href="mailto:inserisci@email.it?subject=Richiesta HVAC/BMS Check-up" className="inline-flex items-center justify-center px-6 py-3 bg-white text-zinc-950 hover:bg-emerald-400 hover:text-zinc-950 rounded-lg font-bold transition-colors w-full sm:w-auto shadow-lg">
                                    Richiedi il Check-up Ora
                                </a>
                            </div>
                        </div>
                        <div className="hidden md:flex justify-center">
                            {/*  Tech / Document abstract representation  */}
                            <div className="relative w-56 h-72 bg-zinc-800 rounded-lg border border-zinc-700 shadow-2xl transform rotate-3 flex flex-col p-5">
                                <div className="w-2/3 h-2 bg-emerald-500/50 rounded mb-5"></div>
                                <div className="w-full h-2 bg-zinc-600 rounded mb-2"></div>
                                <div className="w-5/6 h-2 bg-zinc-600 rounded mb-2"></div>
                                <div className="w-full h-2 bg-zinc-600 rounded mb-8"></div>
                                
                                <div className="w-full flex-1 border-2 border-dashed border-emerald-500/30 rounded flex items-center justify-center bg-emerald-900/10">
                                    <svg className="w-10 h-10 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                </div>
                                <div className="absolute -bottom-5 -left-5 w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(5,150,105,0.5)] border-4 border-zinc-900">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  5.5 PRICING SECTION  */}
    <section id="pricing" className="py-24 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Modelli di Collaborazione</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Strutture di costo trasparenti per affiancarti dalla singola diagnosi fino alla direzione tecnica continuativa.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                
                {/*  Pricing Card 1: Check-up  */}
                <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 relative group hover:border-emerald-500/50 transition-all">
                    <h3 className="text-xl font-bold text-white mb-2">Diagnostic Check-up</h3>
                    <p className="text-zinc-400 text-sm mb-6">Ideale per prevenire errori prima dell'inizio lavori. Se proseguiamo insieme sul progetto, l'importo sarà interamente dedotto dal preventivo finale.</p>
                    <div className="mb-6">
                        <span className="text-4xl font-extrabold text-white">€ 950</span>
                        <span className="text-zinc-500">/progetto</span>
                    </div>
                    <ul className="space-y-3 text-zinc-300 text-sm mb-8">
                        <li className="flex items-start"><svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Analisi asincrona PDF (schemi e specifiche)</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Report diagnostico sintetico</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Call di debriefing schedulata (1 ora)</li>
                    </ul>
                    <a href="#checkup" className="block w-full py-3 px-4 bg-zinc-900 hover:bg-emerald-600 text-white text-center font-semibold rounded-lg transition-colors border border-zinc-700 hover:border-emerald-500">Richiedi Check-up</a>
                </div>

                {/*  Pricing Card 2: Project Validation  */}
                <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 relative shadow-lg transform md:-translate-y-4 opacity-50 grayscale transition-all">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-zinc-700 whitespace-nowrap">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Sbloccabile post Check-up
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Project Validation</h3>
                    <p className="text-zinc-400 text-sm mb-6">Supervisione strategica a step predefiniti: intervengo solo nelle fasi critiche per mantenere la rotta, senza farti sprecare budget in presidio inutile.</p>
                    <div className="mb-6">
                        <span className="text-4xl font-extrabold text-white">A Corpo</span>
                        <span className="text-zinc-500 block mt-1 text-sm">Preventivo riservato ai progetti analizzati</span>
                    </div>
                    <ul className="space-y-3 text-zinc-400 text-sm mb-8">
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Validazione Architettura e Protocolli</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Revisione Logiche di Controllo</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Verifica offerte subappaltatori</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Analisi log/trend post-avviamento (Offline)</li>
                    </ul>
                    <div className="block w-full py-3 px-4 bg-zinc-800 text-zinc-400 text-center font-semibold rounded-lg border border-zinc-700 cursor-not-allowed">Accessibile dopo la fase diagnostica</div>
                </div>

                {/*  Pricing Card 3: Advisory Asincrono  */}
                <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 relative opacity-50 grayscale transition-all">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-zinc-700 whitespace-nowrap">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        Riservato ai già clienti
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 mt-4">Advisory Asincrono</h3>
                    <p className="text-zinc-400 text-sm mb-6">BMS Expertise as a Service. Un pacchetto mensile garantito per affiancare il tuo ufficio tecnico e sbloccare i nodi critici sui tuoi cantieri.</p>
                    <div className="mb-6">
                        <span className="text-4xl font-extrabold text-white">A Carnet</span>
                        <span className="text-zinc-500 block mt-1 text-sm">Pacchetti riservati ai progetti analizzati</span>
                    </div>
                    <ul className="space-y-3 text-zinc-400 text-sm mb-8">
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Analisi problemi e troubleshooting offline</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Risoluzione asincrona (SLA 48h)</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Call strategiche su prenotazione</li>
                        <li className="flex items-start"><svg className="w-5 h-5 text-zinc-600 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Mese Pilota di prova senza vincoli annuali</li>
                    </ul>
                    <div className="block w-full py-3 px-4 bg-zinc-800 text-zinc-400 text-center font-semibold rounded-lg border border-zinc-700 cursor-not-allowed">Accessibile dopo la fase diagnostica</div>
                </div>

            </div>
        </div>
    </section>

    {/*  6. PRESENTAZIONE PIATTAFORMA NODOCLIMA  */}
    {/*  FLAG_NODOCLIMA: Rimuovere la classe 'hidden' nel tag section qui sotto per renderla visibile  */}
    <section id="nodoclima" className="hidden py-24 bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                        NodoClima:<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">L'ecosistema digitale</span> per la gestione termica intelligente.
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                        Frutto di 30 anni di esperienza nell'integrazione di sistemi, NodoClima è la piattaforma avanzata progettata per connettere, monitorare e ottimizzare gli impianti HVAC e i nodi di termoregolazione complessi. <strong className="text-zinc-200">Un ponte software per tradurre i dati di campo in efficienza energetica reale.</strong>
                    </p>
                    <a href="https://nodoclima.it" target="_blank" rel="noopener" className="inline-flex items-center px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-emerald-500 text-white rounded-lg font-medium transition-all group">
                        <span>Scopri la piattaforma NodoClima</span>
                        <svg className="w-5 h-5 ml-2 text-zinc-500 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                </div>
                <div className="lg:w-1/2 w-full">
                    {/*  Abstract Dashboard Interface  */}
                    <div className="aspect-[4/3] bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden relative flex flex-col p-4">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent"></div>
                        
                        {/*  Top Bar  */}
                        <div className="h-10 border-b border-zinc-800 flex items-center justify-between mb-4 px-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-16 h-4 bg-zinc-800 rounded-sm"></div>
                                <div className="w-8 h-4 bg-emerald-900/40 rounded-sm"></div>
                            </div>
                        </div>

                        {/*  Dashboard Grid  */}
                        <div className="flex-1 grid grid-cols-3 gap-4">
                            {/*  Main Chart Area  */}
                            <div className="col-span-2 flex flex-col gap-4">
                                <div className="flex-1 bg-zinc-900/60 rounded-xl border border-zinc-800/50 p-4 relative flex flex-col justify-end">
                                    <div className="w-24 h-4 bg-zinc-800 rounded mb-auto"></div>
                                    {/*  Bars  */}
                                    <div className="w-full h-24 flex items-end justify-between gap-1 mt-4">
                                        <div className="w-full h-[40%] bg-zinc-800 hover:bg-emerald-500/50 transition-colors rounded-t-sm"></div>
                                        <div className="w-full h-[60%] bg-zinc-800 hover:bg-emerald-500/50 transition-colors rounded-t-sm"></div>
                                        <div className="w-full h-[30%] bg-zinc-800 hover:bg-emerald-500/50 transition-colors rounded-t-sm"></div>
                                        <div className="w-full h-[70%] bg-zinc-800 hover:bg-emerald-500/50 transition-colors rounded-t-sm"></div>
                                        <div className="w-full h-[90%] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] rounded-t-sm"></div>
                                        <div className="w-full h-[50%] bg-zinc-800 hover:bg-emerald-500/50 transition-colors rounded-t-sm"></div>
                                        <div className="w-full h-[80%] bg-zinc-800 hover:bg-emerald-500/50 transition-colors rounded-t-sm"></div>
                                        <div className="w-full h-[45%] bg-zinc-800 hover:bg-emerald-500/50 transition-colors rounded-t-sm"></div>
                                    </div>
                                </div>
                                <div className="h-20 grid grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/50 p-3 flex flex-col justify-center">
                                        <div className="w-12 h-3 bg-zinc-700 rounded mb-2"></div>
                                        <div className="w-20 h-5 bg-emerald-400 rounded"></div>
                                    </div>
                                    <div className="bg-zinc-900/60 rounded-xl border border-zinc-800/50 p-3 flex flex-col justify-center">
                                        <div className="w-16 h-3 bg-zinc-700 rounded mb-2"></div>
                                        <div className="w-14 h-5 bg-white rounded"></div>
                                    </div>
                                </div>
                            </div>
                            {/*  Side Panel  */}
                            <div className="col-span-1 bg-zinc-900/60 rounded-xl border border-zinc-800/50 p-4 flex flex-col gap-3">
                                <div className="w-full h-8 bg-zinc-800/80 rounded"></div>
                                <div className="w-full h-8 bg-zinc-800/80 rounded"></div>
                                <div className="w-full h-8 bg-zinc-800/80 rounded"></div>
                                <div className="w-full h-8 bg-emerald-900/20 border border-emerald-500/30 rounded text-emerald-500 flex items-center justify-center text-[10px] uppercase font-bold mt-auto tracking-wider">Live Sync</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/*  7. FOOTER & DISCLAIMER LEGALE  */}
    <footer className="bg-zinc-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-zinc-800 pb-8 mb-8">
                <div className="mb-6 md:mb-0 text-center md:text-left">
                    <span className="text-white font-bold text-xl block mb-1">Mario Bortolazzi</span>
                    <span className="text-zinc-500 text-sm">Senior System Integrator & Advisor</span>
                </div>
                <div className="flex space-x-6">
                    {/*  LinkedIn  */}
                    <a href="#" className="text-zinc-500 hover:text-emerald-400 transition-colors">
                        <span className="sr-only">LinkedIn</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                    {/*  Email  */}
                    <a href="mailto:inserisci@email.it" className="text-zinc-500 hover:text-emerald-400 transition-colors">
                        <span className="sr-only">Email</span>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </a>
                </div>
            </div>
            
            <div className="text-center md:text-left text-xs text-zinc-600">
                <p className="mb-3">&copy; 2026 MB Consultech di Mario Bortolazzi. Partita IVA: [Inserire P.IVA]. Tutti i diritti riservati.</p>
                <p className="max-w-4xl text-zinc-500/70 border border-zinc-800/50 p-3 rounded-lg bg-zinc-900/30">
                    <strong>Nota legale:</strong> Attività di consulenza strategico-operativa esente da responsabilità di firma ex DM 37/08. P.IVA [Inserire P.IVA]. I servizi offerti consistono in architettura logica, diagnostica e advisory tecnologica indipendente, e non si sostituiscono alla progettazione esecutiva né alla direzione lavori normate dalla legislazione vigente.
                </p>
            </div>
        </div>
    </footer>


    </>
  );
}

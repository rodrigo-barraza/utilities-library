// ─────────────────────────────────────────────────────────────
// Text — String manipulation and sanitization utilities
// ─────────────────────────────────────────────────────────────
export function stripHtml(html) {
    if (!html)
        return "";
    return html
        .replace(/<br\s*\/?>/gi, " ")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
}
export function normalizeName(text) {
    if (!text)
        return "";
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, " ");
}
// Display-name overrides for tools whose algorithmically generated
// titles are too vague (single word, ambiguous, or non-descriptive).
const TOOL_DISPLAY_OVERRIDES = {
    // Task Management
    get_task: "Get Task",
    create_task: "Create Task",
    list_tasks: "List Tasks",
    update_task: "Update Task",
    get_task_output: "Get Task Output",
    write_todo: "Write Todo",
    // TODO(cleanup): Remove legacy pre-action-first names below once historical
    // MongoDB sessions containing old tool names have aged out.
    task_get: "Get Task",
    task_create: "Create Task",
    task_list: "List Tasks",
    task_update: "Update Task",
    task_output: "Get Task Output",
    todo_write: "Write Todo",
    file_info: "Get File Info",
    file_diff: "Compare Files",
    // File Operations
    get_file_info: "Get File Info",
    diff_files: "Compare Files",
    read_file: "Read File",
    write_file: "Write File",
    replace_in_file: "Replace in File",
    patch_file: "Patch File",
    read_files: "Read Multiple Files",
    move_file: "Move File",
    delete_file: "Delete File",
    // Search & Discovery
    list_directory: "List Directory",
    search_file_contents: "Search File Contents",
    find_files: "Find Files",
    summarize_project: "Summarize Project",
    // Web
    read_web_page: "Read Web Page",
    read_pdf: "Read PDF Document",
    read_docx: "Read DOCX Document",
    read_spreadsheet: "Read Spreadsheet",
    read_rss_feed: "Read RSS Feed",
    search_web: "Search Web",
    fetch_url: "Fetch URL Content",
    // Command Execution
    execute_command: "Execute Command",
    // Headless Browser Automation
    control_browser: "Control Browser",
    execute_browser_script: "Execute Browser Script",
    // Code Intelligence (LSP)
    query_language_server: "Query Language Server",
    // Memory Persistence
    save_memory: "Save Memory",
    // Agent & Tool Management
    create_custom_agent: "Create Custom Agent",
    tool_search: "Search Available Tools",
    // Cron Jobs
    create_cron: "Create Cron Job",
    remote_trigger: "Trigger Remote Job",
    create_cron_job: "Create Cron Job",
    list_cron_jobs: "List Cron Jobs",
    delete_cron_job: "Delete Cron Job",
    trigger_cron_job: "Trigger Cron Job",
    // Skills
    create_skill: "Create Skill",
    execute_skill: "Execute Skill",
    list_skills: "List Skills",
    delete_skill: "Delete Skill",
    // Coordinator
    create_team: "Create Team",
    delete_team: "Delete Team",
    // Notebook Editing
    edit_notebook: "Edit Notebook",
    // Twilio Communication
    send_sms: "Send SMS",
    list_sms_messages: "List SMS Messages",
    get_sms_account: "Get SMS Account",
    lookup_phone_number: "Lookup Phone Number",
    list_phone_numbers: "List Phone Numbers",
    // Creative (Emoji Kitchen, Image, Audio)
    get_emoji_combination: "Combine Emojis",
    get_emoji_combinations: "Search Emoji Combinations",
    generate_image: "Generate AI Image",
    describe_image: "Analyze Image Contents",
    synthesize_speech: "Synthesize Speech",
    generate_audio: "Generate Audio",
    transcribe_audio: "Transcribe Audio",
    // Discord
    search_discord_messages: "Search Discord Messages",
    get_discord_server_activity: "Get Discord Server Activity",
    // Smart Home (LIFX Lights)
    list_lights: "List Lights",
    set_light_state: "Set Light State",
    toggle_light_power: "Toggle Light Power",
    start_light_breathe_effect: "Start Light Breathe Effect",
    start_light_pulse_effect: "Start Light Pulse Effect",
    stop_light_effects: "Stop Light Effects",
    list_light_scenes: "List Light Scenes",
    activate_light_scene: "Activate Light Scene",
    // Weather & Environment
    get_weather_forecast: "Get Weather Forecast",
    get_avalanche_forecast: "Get Avalanche Forecast",
    get_weather: "Get Weather Report",
    get_local_environment: "Get Local Environment",
    get_earthquakes: "Get Earthquakes List",
    get_solar_activity: "Get Solar Activity",
    get_aurora_forecast: "Get Aurora Forecast",
    get_solar_wind: "Get Solar Wind Status",
    get_twilight: "Get Twilight Times",
    get_tides: "Get Tide Forecasts",
    get_wildfires: "Track Active Wildfires",
    get_iss_location: "Get ISS Location",
    get_near_earth_objects: "Get Near-Earth Objects",
    get_space_launches: "Get Space Launches",
    get_nasa_apod: "Get NASA Picture of the Day",
    get_pollen_forecast: "Get Pollen Forecast",
    get_weather_warnings: "Get Weather Warnings",
    get_detailed_air_quality: "Get Air Quality Info",
    // Markets, Trends, Products
    get_events: "Search Local Events",
    get_commodities: "Get Commodity Prices",
    get_trends: "Get Trending Topics",
    search_products: "Search Products",
    get_trending_products: "Get Trending Products",
    search_amazon_products: "Search Amazon Products",
    get_product_availability: "Get Product Availability",
    check_product_availability: "Check Product Availability",
    get_costco_us_products: "Search Costco US Products",
    get_costco_ca_products: "Search Costco CA Products",
    get_market_news: "Get Market News",
    get_earnings_calendar: "Get Earnings Calendar",
    get_stock: "Lookup Stock Quote",
    get_stock_data: "Get Stock Data",
    get_macro: "Get Macro Indicators",
    get_macro_data: "Get Macro Data",
    // Knowledge Databases
    lookup_book: "Lookup Book Info",
    get_country: "Lookup Country Info",
    get_country_data: "Get Country Data",
    get_element: "Lookup Periodic Element",
    get_element_data: "Get Element Data",
    get_exoplanet: "Search Exoplanet Catalog",
    get_exoplanet_data: "Get Exoplanet Data",
    get_anime: "Search Anime Database",
    define_word: "Define Word",
    search_papers: "Search Academic Papers",
    get_youtube_video: "Get YouTube Video Info",
    get_package_info: "Get Package Info",
    get_wikipedia_summary: "Get Wikipedia Summary",
    get_on_this_day: "Get On This Day Events",
    get_pypi_package: "Lookup PyPI Package",
    get_dota: "Lookup Dota 2 Stats",
    get_music: "Search Music Catalog",
    // Movies & TV
    search_media: "Search Movies & TV",
    get_media_details: "Get Movie & TV Details",
    get_media_credits: "Get Movie & TV Credits",
    get_trending_media: "Get Trending Movies & TV",
    discover_media: "Discover Movies & TV",
    get_media_genres: "Get Movie & TV Genres",
    // Health, Nutrition & Exercise
    rank_foods: "Rank Foods by Category",
    search_drugs: "Search Drugs",
    get_drug_adverse_events: "Get Drug Adverse Events",
    get_drug_recalls: "Get Drug Recalls",
    search_gym_exercises: "Search Gym Exercises",
    get_gym_exercise_categories: "Get Gym Exercise Categories",
    get_gym_exercise_by_id: "Get Gym Exercise by ID",
    search_usda_nutrition: "Search USDA Nutrition",
    rank_foods_by_nutrient: "Rank Foods by Nutrient",
    compare_food_nutrition: "Compare Food Nutrition",
    get_food_categories: "Get Food Categories",
    get_nutrient_types: "Get Nutrient Types",
    list_category_nutrients: "List Category Nutrients",
    search_foods_by_taxonomy: "Search Foods by Taxonomy",
    browse_food_taxonomy: "Browse Food Taxonomy",
    get_nutritional_requirements: "Get Nutritional Requirements",
    calculate_caloric_needs: "Calculate Caloric Needs",
    analyze_nutrient_gaps: "Analyze Nutrient Gaps",
    find_food_substitutes: "Find Food Substitutes",
    estimate_exercise_calories: "Estimate Exercise Calories",
    calculate_hydration_needs: "Calculate Hydration Needs",
    build_meal_plan: "Build Meal Plan",
    check_drug_nutrient_interactions: "Check Drug-Nutrient Interactions",
    // Transit
    get_next_bus: "Check Next Bus Arrival",
    get_transit_stop_info: "Get Transit Stop Info",
    find_transit_stops_nearby: "Find Nearby Transit Stops",
    get_transit_route_info: "Get Transit Route Info",
    // Utilities & Compute
    execute_python: "Execute Python Script",
    precise_calculator: "Calculate Precise Math",
    execute_javascript: "Execute JavaScript Code",
    execute_shell: "Execute Shell Command",
    convert_units: "Convert Units",
    parse_datetime: "Parse Date & Time",
    transform_json: "Transform JSON Structure",
    generate_csv: "Generate CSV",
    generate_qr_code: "Generate QR Code",
    render_latex: "Render LaTeX Math",
    generate_diagram: "Generate Diagram",
    diff_text: "Diff Text Blocks",
    generate_hash: "Generate Cryptographic Hash",
    regex_tester: "Test Regular Expression",
    convert_encoding: "Convert Encoding",
    convert_color: "Convert Color Space",
    turtle_draw: "Draw Turtle Graphics",
    convert_currency: "Convert Currency",
    get_time_in_timezone: "Get Time in Timezone",
    lookup_ip: "Lookup IP Address",
    search_nearby_places: "Search Nearby Places",
    search_places: "Search Places",
    generate_map: "Generate Map View",
    generate_chart: "Generate Chart",
    list_development_indicators: "List Development Indicators",
    lookup_airport: "Lookup Airport Info",
    get_public_webcams: "Get Public Webcams",
    list_drug_dosage_forms: "List Drug Dosage Forms",
    // Maritime
    get_tracked_vessels: "Get Tracked Vessels",
    get_vessel_by_mmsi: "Get Vessel by MMSI",
    search_vessels: "Search Vessels",
    get_vessels_in_area: "Get Vessels in Area",
    get_ais_messages: "Get AIS Messages",
    // Energy
    get_energy_indicators: "Get Energy Indicators",
    browse_energy_data: "Browse Energy Data",
    get_energy_facets: "Get Energy Facets",
    query_energy_data: "Query Energy Data",
    get_electricity_retail_sales: "Get Electricity Retail Sales",
    get_petroleum_prices: "Get Petroleum Prices",
    get_natural_gas_prices: "Get Natural Gas Prices",
    // Reasoning & Control Flow
    think: "Think Step-by-Step",
    sleep: "Delay Execution",
};
export function renderToolName(name) {
    if (TOOL_DISPLAY_OVERRIDES[name])
        return TOOL_DISPLAY_OVERRIDES[name];
    return name
        .replace(/^(get_|mcp__[\w.-]+__)/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}
export function humanizeToolName(name) {
    return name
        .replace(/^(get|set|search|list|create|delete|update|fetch|read|write|check|run|execute|find|query|rank|lookup|send|track|stop|cancel|submit|browse|navigate|click|scroll|type|clear|wait|close|open|save|load|ask|plan|log|emit|extract|consolidate|manage|add|remove|use|exit|enter)_/i, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}
export function truncate(text, maximumLength = 80, suffix = "…") {
    if (!text || text.length <= maximumLength)
        return text || "";
    return text.slice(0, maximumLength - suffix.length) + suffix;
}
export function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
export function getRootDomain(fullyQualifiedDomainName) {
    if (!fullyQualifiedDomainName)
        return "";
    const parts = fullyQualifiedDomainName.split(".");
    return parts.length <= 2 ? fullyQualifiedDomainName : parts.slice(-2).join(".");
}
export function getSubdomain(fullyQualifiedDomainName) {
    if (!fullyQualifiedDomainName)
        return "";
    const parts = fullyQualifiedDomainName.split(".");
    return parts.length <= 2 ? "" : parts.slice(0, -2).join(".");
}
export function capitalize(text) {
    if (!text)
        return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}
export function slugify(text) {
    if (!text)
        return "";
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s-]+/g, "-");
}
export function toKebabCase(text) {
    if (!text)
        return "";
    return text
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
}
export function toCamelCase(text) {
    if (!text)
        return "";
    return text
        .replace(/[-_\s]+(.)?/g, (_, character) => (character ? character.toUpperCase() : ""))
        .replace(/^[A-Z]/, (character) => character.toLowerCase());
}
export function toPascalCase(text) {
    if (!text)
        return "";
    const camelCaseString = toCamelCase(text);
    return camelCaseString.charAt(0).toUpperCase() + camelCaseString.slice(1);
}
export function toSnakeCase(text) {
    if (!text)
        return "";
    return text
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[-\s]+/g, "_")
        .toLowerCase();
}
export function pluralize(word, count, plural) {
    if (count === 1)
        return word;
    return plural || word + "s";
}
export function wordCount(text) {
    if (!text)
        return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
}
//# sourceMappingURL=text.js.map
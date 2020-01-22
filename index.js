function newWordContainer(){
    const newWordBtn = $("#container");
    
    newWordBtn.on("click", ".new-word-btn", (e)=>{

        $("#container").append(`<section class="word-container">
                    
        <section class="word-list">

            <form class="word-list-form">
                <fieldset>
                    <legend>
                        <h2>

                        </h2>
                    </legend>

                    <input type="text" />

                    <select class="word-option">
                        <option value="rhyme">Rhyme</option>
                        <option value="syllable">Syllable</option>
                    </select>

                    <select class="lang-option">
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                    </select>

                    <button type="submit" class="word-list-submit">Find words</button>
                </fieldset>
            </form>

            <button class="new-word-btn">new word</button>
            
        </section>
        
    </section>`)});
};

function fetchData(){
    const container = $("#container");    
    
    container.on("click", ".word-list-submit", (e)=>{
        const input = $(e.target).siblings("input").val();
        const option = $(e.target).siblings(".word-option").val() == "rhyme" ? "rel_rhy" : "sp"
        const divContainer = $(e.target).closest(".word-list");
        const langOption = $(e.target).siblings(".lang-option");
        const url = langOption.val() == "english" ? `https://api.datamuse.com/words?${option}=${input}&md=s&max=1000` : `https://api.datamuse.com/words?${option}=${input}&md=s&max=1000&v=es`;

        e.preventDefault();
        
        divContainer.append(`<details><summary>Words</summary><select class="word-list-data"></select></details>`);

        fetch(url)
            .then( res => {
                if(!res.ok){
                    return res.json().then( e => Promise.reject());
                };

                return res.json();
            })
            .then( resData => {
                console.log(resData)
                renderResults(resData, $(e.target).closest(".word-list-form").siblings("details").children(".word-list-data"));
            })
            .catch( err => console.log(err));
    });
}

function renderResults(results, target){
    
    if(results.length === 0){

        target.append(`<option value="empty">No words were found</option>`);

        return;
    }

    results.sort( (a, b)=>{
        if( a.word > b.word){
            return 1;
        };

        if( b.word > a.word){
            return -1;
        }
        return 0;
    });

    results.sort( (a, b)=>{
        if( a.numSyllables > b.numSyllables){
            return 1;
        };

        if( b.numSyllables > a.numSyllables){
            return -1;
        }
        return 0;
    });

    for( let i = 0; i < results.length; i++){
        target.append(`<option value=${results[i].word}>Word: ${results[i].word} Syllables: ${results[i].numSyllables}</option>`)
    }
}

function renderSentence(){
    const container = $("#container");
    const selects = $(".word-list-data");
    const sentenceContainer = $("#word-sentence").children(".sentence");
    
    let sentence = "";

    container.on("change", ".word-list-data", (e)=>{
        console.log("Changed", $(e.target).val())
        sentence += " " + $(e.target).val();
        console.log(sentence)
        sentenceContainer.html(sentence);
    });

    console.log(sentence);
}

newWordContainer();
renderSentence();
fetchData();
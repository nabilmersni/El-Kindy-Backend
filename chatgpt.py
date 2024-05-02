import nltk
import random
from nltk.chat.util import Chat, reflections
import sys
# Download necessary NLTK data
nltk.download('punkt')
nltk.download('wordnet')

patterns = [
    (r'hi|hello|hey', ['Hello!', 'Hi there!', 'Hey!']),
    (r'how are you?', ['I\'m good, thank you!', 'I\'m doing well, thanks for asking.']),
    (r'what is your name?', ['You can call me ChatGPT.', 'I go by the name ChatGPT.']),
    (r'(.*) your name?', ['You can call me ChatGPT.', 'I go by the name ChatGPT.']),
    (r'(.*) your favorite music genre?', ['I enjoy various genres, but I particularly like electronic music.', 'I listen to a variety of genres, but electronic music is one of my favorites.']),
    (r'(.*) favorite artist?', ['I don\'t have personal preferences, but I appreciate the works of many artists.', 'I don\'t have a favorite artist, but I enjoy listening to a wide range of musicians.']),
    (r'(.*) recommend a song', ['Sure! How about "Bohemian Rhapsody" by Queen?', 'You might enjoy listening to "Stairway to Heaven" by Led Zeppelin.']),
    (r'(.*) instruments do you like?', ['As a virtual assistant, I don\'t have personal preferences, but I find all musical instruments fascinating.', 'I don\'t have preferences, but I think all musical instruments have unique qualities.']),
    (r'(.*) your favorite band?', ['I don\'t have personal favorites, but there are many great bands out there.', 'I don\'t have a favorite band, but I appreciate the music of numerous bands.']),
    (r'(.*) genre do you dislike?', ['As an AI, I don\'t have personal likes or dislikes, but I try to appreciate all genres of music.', 'I don\'t have dislikes, but I strive to understand and appreciate different music genres.']),
    (r'(.*) genre is best?', ['The "best" genre is subjective and depends on personal preferences. There are many great genres to explore!', 'There isn\'t a definitive answer to that question. Each genre has its own unique appeal.']),
    (r'(.*) musical instrument do you play?', ['I don\'t have the capability to play musical instruments, but I can certainly talk about them!', 'I don\'t play musical instruments myself, but I\'m knowledgeable about them.']),
    (r'(.*) your opinion on classical music?', ['Classical music is timeless and has contributed significantly to the world of music. It\'s a genre worth exploring.', 'Classical music is rich in history and complexity, making it a fascinating genre to explore.']),
    (r'(.*) like jazz music?', ['I don\'t have personal preferences, but jazz music is enjoyed by many people for its improvisational and expressive qualities.', 'Jazz music is known for its creativity and spontaneity, which appeals to a wide audience.']),
    (r'(.*) favorite song?', ['As an AI, I don\'t have personal favorites, but there are many great songs to choose from across various genres.', 'I don\'t have a favorite song, but I appreciate the diversity of music and enjoy exploring different tracks.']),
    (r'(.*) genre of music do you listen to?', ['I don\'t have the ability to listen to music myself, but I\'m knowledgeable about various genres and can discuss them.', 'I don\'t listen to music personally, but I\'m well-versed in different music genres.']),
    (r'(.*) heavy metal music?', ['Heavy metal music is characterized by its aggressive sound and powerful instrumentation. It has a dedicated fanbase and a rich history.', 'Heavy metal is known for its loud, distorted guitars and intense vocals, making it a popular genre for those who enjoy energetic music.']),
    (r'(.*) like pop music?', ['Pop music is widely popular for its catchy melodies and relatable lyrics. It appeals to a broad audience and often dominates the charts.', 'Pop music is known for its catchy hooks and infectious beats, making it a favorite among many listeners.']),
    (r'(.*) country music?', ['Country music often tells stories about everyday life, love, and heartbreak. It has a strong emphasis on storytelling and is beloved by many for its relatable lyrics.', 'Country music is known for its storytelling and often incorporates themes of love, heartbreak, and life in rural America.']),
    (r'(.*) electronic music?', ['Electronic music is characterized by its use of synthesizers, drum machines, and computer technology to create unique sounds and textures. It encompasses a wide range of styles, from ambient to techno.', 'Electronic music is known for its innovative use of technology and its ability to push the boundaries of sound.']),
    (r'(.*) rap music?', ['Rap music is known for its rhythmic delivery and lyrical storytelling. It has roots in African American culture and has become a global phenomenon with artists from all backgrounds.', 'Rap music is characterized by its use of spoken word and rhythmic delivery, often addressing social and political issues.']),
    (r'(.*) rock music?', ['Rock music is characterized by its use of electric guitars, bass, and drums. It has a rich history and encompasses a wide range of styles, from classic rock to alternative and indie rock.', 'Rock music is known for its high energy and rebellious spirit, making it a favorite among listeners of all ages.']),
    (r'(.*) classical music?', ['Classical music refers to a tradition of Western music composed between the 9th century and the present day. It includes a wide range of styles, from Baroque and Romantic to Contemporary classical music.', 'Classical music is known for its complexity, beauty, and rich history. It has influenced many other genres of music and continues to be appreciated by audiences around the world.']),
    (r'(.*) your favorite song lyrics?', ['As an AI, I don\'t have personal favorites, but there are many great songs with memorable lyrics.']),
    (r'(.*) song lyrics?', ['There are countless songs with beautiful and meaningful lyrics. It depends on personal preference and the mood you\'re in.']),
    (r'(.*) music festival?', ['Music festivals are events where multiple artists perform live music over the course of several days. They often feature a diverse lineup of artists and genres, along with food, art, and other activities.', 'Music festivals are a great way to experience live music from a variety of artists and genres in one place. They can be a lot of fun and offer a unique atmosphere that you can\'t find anywhere else.']),
    (r'(.*) concert?', ['A concert is a live performance by one or more musicians or musical groups. It can take place in a variety of venues, from small clubs to large stadiums, and feature different genres of music.']),
    (r'(.*) music streaming service?', ['Music streaming services allow users to listen to music online without having to download or purchase individual tracks. They offer a vast catalog of songs, albums, and playlists that can be accessed on demand. Some popular music streaming services include Spotify, Apple Music, and Amazon Music.']),
    (r'(.*) music app?', ['Music apps are applications designed for listening to, discovering, and organizing music on mobile devices. They offer features such as personalized recommendations, curated playlists, and offline listening. Some popular music apps include Spotify, Apple Music, and Pandora.']),
    (r'(.*) music production software?', ['Music production software, also known as digital audio workstations (DAWs), is software used to create, record, edit, and mix music. It includes tools for composing melodies, arranging tracks, and applying effects. Some popular music production software includes Ableton Live, FL Studio, and Logic Pro.']),
    (r'(.*) music theory?', ['Music theory is the study of the principles and practices of music. It covers topics such as harmony, melody, rhythm, and form, and provides a framework for understanding how music works.']),
    (r'(.*) music education?', ['Music education is the teaching and learning of music. It can take place in schools, community centers, private lessons, and online courses, and covers a wide range of topics including music theory, history, performance, and composition.']),
    (r'(.*) music therapy?', ['Music therapy is the use of music to address physical, emotional, cognitive, and social needs. It can be used to promote relaxation, reduce stress, improve communication skills, and enhance overall well-being.']),
    (r'(.*) music history?', ['Music history is the study of the development of music over time. It examines the evolution of musical styles, genres, and forms, as well as the cultural, social, and historical contexts in which music was created.']),
    (r'(.*) music genre originated?', ['Many music genres originated in specific cultural and geographical contexts. For example, jazz originated in African American communities in New Orleans, while country music has its roots in the folk music traditions of the Southern United States.']),
    (r'(.*) classical music composer?', ['Classical music has produced many famous composers, including Ludwig van Beethoven, Wolfgang Amadeus Mozart, and Johann Sebastian Bach. These composers have made significant contributions to the classical music canon and continue to be celebrated today.']),
    (r'(.*) electronic music artist?', ['Electronic music encompasses a wide range of artists and styles, from pioneers like Kraftwerk and Brian Eno to contemporary artists like Daft Punk and Aphex Twin. These artists have pushed the boundaries of electronic music and influenced generations of musicians.']),
    (r'(.*) pop music artist?', ['Pop music has produced many iconic artists, from Elvis Presley and The Beatles to Madonna and Michael Jackson. These artists have dominated the charts and shaped popular music culture for decades.']),
    (r'(.*) rock band?', ['Rock music has produced countless legendary bands, including The Rolling Stones, Led Zeppelin, and The Beatles. These bands have had a profound influence on rock music and popular culture as a whole.']),
    (r'(.*) jazz musician?', ['Jazz music has produced many influential musicians, from Louis Armstrong and Duke Ellington to Miles Davis and John Coltrane. These musicians have helped define the sound and style of jazz and continue to inspire new generations of artists.']),
    (r'(.*) country music singer?', ['Country music has produced many talented singers, from Johnny Cash and Dolly Parton to Garth Brooks and Shania Twain. These singers have helped shape the sound and storytelling traditions of country music and have become icons in the genre.']),
    (r'(.*) rap artist?', ['Rap music has produced many groundbreaking artists, from Grandmaster Flash and Run-D.M.C. to Tupac Shakur and Eminem. These artists have used rap music as a platform to address social and political issues and have become influential figures in popular culture.']),
    (r'(.*) heavy metal band?', ['Heavy metal music has produced many iconic bands, from Black Sabbath and Iron Maiden to Metallica and Slayer. These bands have pushed the boundaries of heavy metal music and have amassed dedicated fanbases around the world.']),
    (r'(.*) music festival attend?', ['Music festivals are a great way to discover new artists, experience live music, and connect with other music fans. They offer a diverse lineup of artists and genres, along with food, art, and other activities.']),
    (r'(.*) favorite music memory?', ['As an AI, I don\'t have personal memories, but I enjoy hearing about the music memories of others. Feel free to share your favorite music memories with me!', 'I don\'t have personal memories, but I\'m always interested in hearing about the music experiences that have shaped people\'s lives.']),
    (r'(.*) music trivia?', ['Sure! Did you know that Beethoven became completely deaf by the time he composed some of his most famous works, including his Ninth Symphony?', 'Here\'s a music trivia fact: Bob Dylan\'s real name is Robert Zimmerman.']),
    (r'(.*) favorite musical instrument?', ['I don\'t have personal preferences, but I find all musical instruments fascinating.', 'I don\'t have preferences, but I think all musical instruments have unique qualities.']),
    (r'(.*) instrument do you play?', ['I don\'t have the capability to play musical instruments, but I can certainly talk about them!', 'I don\'t play musical instruments myself, but I\'m knowledgeable about them.']),
    (r'(.*) your opinion on [a specific instrument, e.g., piano]?', ['[Insert your opinion here]', '[Insert another opinion here]']),
    (r'(.*) like [a specific instrument, e.g., guitar]?', ['I don\'t have personal preferences, but [specific instrument] is enjoyed by many people for its [insert qualities].', '[Specific instrument] is known for its [insert qualities], which appeals to a wide audience.']),
    (r'(.*) instrument is best for beginners?', ['For beginners, [insert instrument] is often recommended because [insert reasons].', '[Insert instrument] is great for beginners because [insert reasons].']),
    (r'(.*) instrument is hardest to learn?', ['Learning [insert instrument] can be challenging because [insert reasons].', '[Insert instrument] is considered difficult to learn due to [insert reasons].']),
    (r'(.*) instrument is most versatile?', ['[Insert instrument] is considered one of the most versatile instruments because [insert reasons].', 'Many musicians consider [insert instrument] to be highly versatile because [insert reasons].']),
    (r'(.*) instrument has the most beautiful sound?', ['[Insert instrument] is often praised for its beautiful sound because [insert reasons].', 'Many people find [insert instrument] to have a beautiful sound due to [insert reasons].']),
    (r'(.*) instrument do you recommend for [specific purpose, e.g., relaxation]?',['For [specific purpose], [insert instrument] is often recommended because [insert reasons].', '[Insert instrument] is great for [specific purpose] because [insert reasons].']),
    (r'(.*) instrument do you think is underrated?', ['[Insert instrument] is often overlooked, but it has [insert qualities] that make it worth exploring.', 'Many people underestimate [insert instrument], but it has [insert qualities] that deserve more recognition.']),
    (r'(.*) instrument do you think is overrated?', ['While [insert instrument] is popular, some argue that its popularity overshadows other equally deserving instruments.', '[Insert instrument] is widely praised, but some believe its reputation is inflated compared to its actual merits.']),
    (r'give me the list of musical instruments', ['Sure! Here are some common musical instruments: piano, guitar, violin, drums, flute, saxophone, trumpet, clarinet, cello, harp, accordion, ukulele, and tambourine.', 'Of course! Some musical instruments include piano, guitar, violin, drums, flute, saxophone, trumpet, clarinet, cello, harp, accordion, ukulele, and tambourine.'])
    # Add more patterns and responses here
]


def get_response(user_input):
    for pattern, responses in patterns:
        if nltk.re.match(pattern, user_input):
            return random.choice(responses)
    return "I'm sorry, I didn't understand that."

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
        response = get_response(user_input)
        print(response)
    else:
        print("No input provided.")

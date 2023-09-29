/* eslint-disable quotes */
/* eslint-disable import/no-unresolved */
import { Button } from "@/components";
import CarouselComponent from "@/components/carouselComponent";

const Voting = () => {
  const info = [
    {
      id: 1,
      name: "Magnus Carlsen",
      party:
        "https://static.vecteezy.com/system/resources/previews/012/093/587/original/norway-square-flag-button-social-media-communication-sign-business-icon-vector.jpg",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Magnus_Carlsen_in_2023.jpg/480px-Magnus_Carlsen_in_2023.jpg",
      description: "Norway",
    },
    {
      id: 2,
      name: "Bobby Fischer",
      party: "https://vectorflags.s3.amazonaws.com/flags/us-square-01.png",
      image:
        "https://thumbor.bigedition.com/fischer/U3s45jYcHuyeHro75TW8OcX3CD0=/480x480/filters:quality(80)/granite-web-prod/88/fb/88fbc7a791f7462b8be9bbc6ec524b82.jpeg",
      description: "United States of America",
    },
    {
      id: 3,
      name: "Anish Giri",
      party:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAG1BMVEWuHCj///8hRouuGib68/T5+vw8W5ccQ4qvEyPDqV1LAAAA0ElEQVR4nO3PAQGCABAAsRcE7Z+YHPdsDTYDAAAAAAAAAAAAAAAAAAAAvNC53fy3m+9289nOsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7Bvru3m3m5+282xnWGfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9h3wOUcN19zBZmDwAAAABJRU5ErkJggg==",
      image:
        "https://i0.wp.com/unoscacchista.com/wp-content/uploads/2023/01/WaZ23-Giri.jpg?resize=480%2C480&ssl=1",
      description: "Netherlands",
    },
    {
      id: 4,
      name: "Ian Nepomniachtchi",
      party:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAG1BMVEX////VKx4AOabl6/YAPKgAN6UAOaK/LC7XKxw54QadAAAA0ElEQVR4nO3PAQGCABAAsRcE7Z+YHPdsDTYDAAAAAAAAAAAAAAAAAAAAsNC53Xy3m2u7ObYz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPsM+wz7DPse8Hw3m5+281/u/lsZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfYZ9hn2GfY9wDGpNu7b5+bSAAAAABJRU5ErkJggg==",
      image:
        "https://www.reuters.com/resizer/PaYL5boKcex9QdrgRUVyBvuxXzA=/480x480/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/MBJV3KNL4JODBGKVMI7R3NRPAI.jpg",
      description: "Russia",
    },
    {
      id: 5,
      name: "Judit Polgar",
      party:
        "https://cdn4.iconfinder.com/data/icons/square-world-flags/180/flag_hungary-512.png",
      image:
        "https://s.yimg.com/ny/api/res/1.2/oiuHKCbrduk36IGOT2tVLw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTY0MA--/https://media.zenfs.com/en/business-wire.com/9f7c973e938c4c1298fd112156a71295",
      description: "Hungary",
    },
  ];

  return (
    <div className="z-0 mx-24 pt-16">
      {/* <div className="text-2xl">Voting</div> */}
      <CarouselComponent>
        {info.map((i) => (
          <div className="relative min-w-full flex justify-center items-center">
            <img
              className="rounded-2xl border-2 shadow-2xl"
              src={i.image}
              alt="###"
            />
            {/* on top of image part */}
            {/* Description and Sign Part */}
            <div className="absolute flex top-0">
              <p className="break-normal text-left w-64 text-white text-xl mr-18 mt-4">
                {i.description}
              </p>
              <div>
                <img
                  className="bg-white h-24 p-3 rounded-b-3xl ml-20"
                  src={i.party}
                  alt="###"
                />
              </div>
            </div>
            {/* Name Part */}
            <div className="absolute bottom-6 bg-white/[0.7] w-96 px-10 py-5 rounded-2xl">
              <h1 className="text-2xl font-extrabold text-black flex justify-center">{i.name}</h1>
              <Button btnName="vote" classStyles="rounded-lg" />
            </div>
          </div>
        ))}
      </CarouselComponent>
    </div>
  );
};

export default Voting;

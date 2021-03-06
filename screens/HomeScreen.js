import { useNavigation } from "@react-navigation/native";
import React, 
    { useRef,
    useState,
    useLayoutEffect,
    useEffect} from "react";
import { 
    View, 
    Text, 
    Button, 
    TouchableOpacity, 
    Image,
    StyleSheet } from "react-native";
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
    AntDesign, 
    Entypo, 
    Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  DocumentSnapshot,
  getDocs,
  onSnapshot,
  onSnapshotsInSync,
  query,
  serverTimestamp,
  setDoc,
  where,
  doc,
  collection,
  getDoc} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";


const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const swipeRef = useRef(null);
  const [profiles, setProfiles] = useState([]);

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });
    return unsub();
  }, []);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };
    fetchCards();
    return unsub;
  }, [db]);
  // Saglab?? datub??z?? lietot??ju identifikatorus, kuri atz??m??ti ar "Nav ieinteres??jis"
  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    console.log("You Swiped PASS on ${userSwiped.displayName}");

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
//  P??rbauda vai j??s viens otru interes??jat un saglab??b?? to datub??z??
  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;
    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (
      await getDoc(doc(db, "users", user.uid))
    ).data();
    //P??rbauda vai lietot??js ir pavilcis pa labi ar?? tev
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          //Ievieto dokumentu ar to, ka esi ??o lietot??ju atz??m??jis ar ieinteres??ts
          console.log("Hooray, YOu matched with someone");
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
          //Izveidot jaunu dokumentu, ka esat viens otru atz??m??ju??i ar ieinteres??ts

          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
            // Lietot??js j??s ir atz??m??jis ar "Nav ieinteres??ts"
          console.log("you swiped on ${userSwiped.displayName}");
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tw("flex-1")}>
      {/* Aug????j?? izv??lnes josla */}
      <View style={tw("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={logout}>
            <Ionicons name="exit-outline" size={40} color="#203B6C" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
        <Image
            style={tw("h-10 w-10 rounded-full ")}
            source={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbox" size={40} color="#203B6C" />
        </TouchableOpacity>
      </View>
      {/* Interakt??v??s k??rtis */}

      <View style={tw("flex-1 -mt-6")}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false} //Iesp??jo to, ka k??rtis var vilkt tikai pa labi/kreisi
        //   Izsauc funkciju, ja tiek atz??m??ts ar "Nav ieinteres??ts"
          onSwipedLeft={(cardIndex) => {
            console.log("Swipe PASS");
            swipeLeft(cardIndex);
          }}
        //   Izsauc funkciju, ja tiek atz??m??ts ar "Ir ieinteres??ts"
          onSwipedRight={(cardIndex) => {
            console.log("Swipe Match");
            swipeRight(cardIndex);
          }}
          //Par??da uz k??rtis, ka neesi ieinteres??ts
          overlayLabels={{
            left: {
              title: "Uninterested",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            //Par??da, ka esi ieinteres??ts
            right: {
              title: "Interested",
              style: {
                label: {
                  color: "#4DED30",
                },
              },
            },
          }}
        //   Izveido interakt??vo k??rti ko par??d??t lietot??jam
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw(" relative bg-white h-3/4 rounded-xl justify-center items-center")}
              >
                    <Text style={tw(" mr-5 ml-5 text-xl italic justify-center")}>
                      {card.intro}
                    </Text>
                <View
                  style={[
                    tw(
                      "absolute bottom-0 bg-white w-full flex-row justify-between items-center h-20 px-6 py-2 rounded-b-xl "
                    ),
                    styles.cardShadow,
                  ]}
                >
                
                  <View>
                    <Text style={tw("text-xl font-bold")}>
                      {card.displayName}
                    </Text>
                    <Text>{card.job}</Text>
                    <Text style={tw("text-xl font-bold")}>{card.age}</Text>
                  </View>
                </View>
              </View>
            ) : (
                // Vair??k nav k??r??u ko par??d??t, t??p??c manu??li uz??ener?? k??rti
              <View
                style={[
                  tw(
                    "relative bg-white h-3/4 rounded-xl justify-center items-center"
                  ),
                  styles.cardShadow,
                ]}
              >
                <Text style={tw("font-bold pb-5")}> No more profiles </Text>
              </View>
            )
          }
        />
      </View>
      {/* Interakt??vo k??r??u beigas */}
      {/* Pogas ar kur??m var pavilk pa labi vai kreisi  */}
      <View style={tw("flex flex-row justify-evenly")}>
        <TouchableOpacity
        onPress={() => swipeRef.current.SwipeLeft()} 
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-green-200 mb-10"
          )}
          
        >
          <Entypo name="cross" size={40} />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-indigo-200 mb-10"
          )}
          onPress={() => navigation.navigate("Info")}
        >
          <AntDesign name="question" size={40} />
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => swipeRef.current.SwipeRight()}
          style={tw(
            "items-center justify-center rounded-full w-16 h-16 bg-red-200"
          )}
          
        >
          <AntDesign name="heart" size={40} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};


export default HomeScreen;
// Interakt??vo k??r??u ??no??ana
const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

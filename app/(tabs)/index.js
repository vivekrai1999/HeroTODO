import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Keyboard,
  Modal,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useRef } from "react";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [enteredTodo, setEnteredTodo] = useState("");
  const [newTodo, setNewTodo] = useState("");
  const [todoTotal, setTodoTotal] = useState(0);
  const [todoComplete, setTodoComplete] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTodoModal, setActiveTodoModal] = useState({});
  const modalInputRef = useRef();

  useEffect(() => {
    setTodoTotal(todoList.length);
    setTodoComplete(
      todoList.filter((todoObj) => todoObj.isComplete == true).length
    );
  }, [todoList]);

  function handleEnteredTodo(enteredTodoText) {
    setEnteredTodo(enteredTodoText);
  }

  function handleAddTodo() {
    if (enteredTodo.length) {
      setTodoList((prevValue) => [
        ...prevValue,
        {
          id: Math.random().toString(),
          text: enteredTodo,
          isComplete: false,
        },
      ]);
      Keyboard.dismiss();
    }
    setEnteredTodo("");
  }

  function handleDeleteTodo(id) {
    setTodoList((prevValue) =>
      prevValue.filter((todoObj) => todoObj.id !== id)
    );
  }

  function handleIsComplete(id) {
    console.log(id);
    setTodoList((prevValue) =>
      prevValue.map((todoObj) =>
        todoObj.id == id
          ? { ...todoObj, isComplete: !todoObj.isComplete }
          : todoObj
      )
    );
  }

  function handleModalVisible(id) {
    setIsModalVisible(true);
    setActiveTodoModal(id);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
    setActiveTodoModal("");
    setNewTodo("");
  }

  function handleNewTodo(newTodo) {
    setNewTodo(newTodo);
  }

  function handleEditModal() {
    if (newTodo.length) {
      setTodoList((prevValue) =>
        prevValue.map((todoObj) =>
          todoObj.id == activeTodoModal
            ? { ...todoObj, text: newTodo }
            : todoObj
        )
      );
      setIsModalVisible(false);
      setActiveTodoModal("");
      setNewTodo("");
    }
  }

  return (
    <>
      <StatusBar style="light" />
      <View style={styles.main}>
        <View style={styles.todoTrack}>
          <View style={styles.todoTrackStatic}>
            <Text style={styles.todoStaticPrimary}>Todo Done</Text>
            <Text style={styles.todoStaticSecondary}>keep it up</Text>
          </View>
          <View style={styles.todoTrackCount}>
            <Text style={styles.todoCountText}>
              {todoComplete}/{todoTotal}
            </Text>
          </View>
        </View>
        <View style={styles.todoEntry}>
          <View style={styles.todoInput}>
            <TextInput
              style={styles.todoInputEntry}
              placeholder="write your next task"
              placeholderTextColor="#D1C0A6"
              value={enteredTodo}
              onChangeText={handleEnteredTodo}
            />
          </View>
          <Pressable onPress={handleAddTodo}>
            <View style={styles.todoAdd}>
              <Ionicons name="add-outline" size={25} color="#000" />
            </View>
          </Pressable>
        </View>
        <FlatList
          data={todoList}
          renderItem={(itemObj) => {
            return (
              <View style={styles.todoListItem}>
                <View style={styles.todoDesc}>
                  <Pressable onPress={() => handleIsComplete(itemObj.item.id)}>
                    <View
                      style={
                        itemObj.item.isComplete
                          ? {
                              height: 30,
                              width: 30,
                              // padding: 10,
                              backgroundColor: "#57CB4C",
                              borderRadius: 100,
                              alignItems: "center",
                              justifyContent: "center",
                            }
                          : {
                              height: 30,
                              width: 30,
                              // padding: 10,
                              borderWidth: 1,
                              borderColor: "#FF5631",
                              borderRadius: 100,
                              alignItems: "center",
                              justifyContent: "center",
                            }
                      }
                    >
                      {itemObj.item.isComplete ? (
                        <Ionicons
                          name="checkmark-outline"
                          size={15}
                          color="#0D0D0D"
                        />
                      ) : (
                        <Ionicons
                          name="close-outline"
                          size={15}
                          color="#FF5631"
                        />
                      )}
                    </View>
                  </Pressable>
                  <View style={styles.todoName}>
                    <Text
                      style={{
                        ...styles.todoNameText,
                        textDecorationLine: itemObj.item.isComplete
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {itemObj.item.text}
                    </Text>
                  </View>
                </View>
                <View style={styles.todoActions}>
                  <Pressable
                    onPress={() => handleModalVisible(itemObj.item.id)}
                  >
                    <View style={styles.todoEdit}>
                      <Ionicons
                        name="create-outline"
                        size={28}
                        color="#D7C7AB"
                      />
                    </View>
                  </Pressable>
                  <Pressable onPress={() => handleDeleteTodo(itemObj.item.id)}>
                    <View style={styles.todoDelete}>
                      <Ionicons
                        name="trash-bin-outline"
                        size={28}
                        color="#D7C7AB"
                      />
                    </View>
                  </Pressable>
                </View>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
        />
      </View>
      {isModalVisible && (
        <BlurView intensity={100} style={styles.absolute} tint="dark">
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onShow={() =>
              setTimeout(() => {
                modalInputRef.current?.focus();
              }, 100)
            }
          >
            <View style={styles.modalParent}>
              <View style={styles.todoEditModal}>
                <TextInput
                  ref={modalInputRef}
                  placeholderTextColor="#D1C0A6"
                  placeholder="Edit Todo"
                  style={{
                    ...styles.todoInputEntry,
                    borderRadius: 10,
                    height: 60,
                  }}
                  value={newTodo}
                  onChangeText={handleNewTodo}
                />
                <View style={styles.modalActions}>
                  <Pressable onPress={handleCloseModal}>
                    <Text style={styles.modalBtn}>Cancel</Text>
                  </Pressable>
                  <Pressable onPress={handleEditModal}>
                    <Text
                      style={{
                        ...styles.modalBtn,
                        borderWidth: 1,
                        borderColor: "#4CAF50",
                      }}
                    >
                      Done
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </BlurView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    padding: 30,
  },

  todoTrack: {
    // backgroundColor: "blue",
    borderWidth: 1,
    borderColor: "#D1C0A6",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 30,
    marginBottom: 30,
  },

  todoTrackStatic: {
    color: "#D1C0A6",
  },

  todoStaticPrimary: {
    color: "#D1C0A6",
    // backgroundColor: "blue",
    fontSize: 30,
    fontWeight: "bold",
  },

  todoStaticSecondary: {
    color: "#D1C0A6",
    letterSpacing: 3,
  },

  todoTrackCount: {
    height: 100,
    width: 100,
    backgroundColor: "#FF5631",
    justifyContent: "center",
    alignItems: "center",
    // padding: 35,
    borderRadius: 100,
  },

  todoCountText: {
    fontSize: 30,
    fontWeight: "bold",
  },

  todoEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "pink",
    // height: 100,
    width: "100%",
    marginBottom: 30,
  },

  todoInputEntry: {
    height: 50,
    width: 290,
    backgroundColor: "#1E1E1E",
    color: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
  },

  todoInput: {},

  todoAdd: {
    backgroundColor: "#FF5631",
    padding: 10,
    borderRadius: 100,
  },

  todoAddText: {},

  todoList: {},

  todoListItem: {
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#D7C7AB",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },

  todoDesc: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  todoCheckbox: {},

  todoName: {
    // backgroundColor: "red",
    width: "65%",
  },

  todoNameText: {
    // backgroundColor: "green",
    fontSize: 20,
    fontWeight: "bold",
    color: "#D7C7AB",
  },

  todoActions: {
    // backgroundColor: "blue",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  todoEdit: {},

  todoDelete: {},

  modalParent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 50,
    // backgroundColor: "blue",
  },

  todoEditModal: {
    height: 200,
    width: 350,
    // backgroundColor: "#E0F7FA",
    // backgroundColor: "#F5F5DC",
    // backgroundColor: "#D7C7AB",
    // backgroundColor: "#2E2E2E",
    // backgroundColor: "#fff",
    // backgroundColor: "#0D0D0D",
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#D1C0A6",
    borderRadius: 20,
    // padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  modalActions: {
    flexDirection: "row",
    gap: 20,
  },

  modalBtn: {
    // backgroundColor: "#FF5631",
    // backgroundColor: "#353535",
    borderWidth: 1,
    borderColor: "#FF5631",
    textAlign: "center",
    textAlignVertical: "center",
    height: 50,
    width: 100,
    borderRadius: 20,
    color: "#D7C7AB",
  },

  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default App;

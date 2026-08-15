import {FC, useState} from "react";
import {Box, Card, Divider, List, ListItem, ListItemText, Typography} from "@mui/material";
import {grey} from "@mui/material/colors";
import dayjs from "dayjs";
import {ListCardProps} from "../../types/declarations";
import {useLongPress} from "@uidotdev/usehooks";
import ActionDialog from "../ActionDialog.tsx";
import {useNavigate} from "react-router-dom";
import {useLazyQuery} from "../../lib/hooks.ts";
import mQuery from "../../queries/mutations.ts";
import {toast} from "react-toastify";
import config from "../../lib/config.ts";

const ListCard: FC<ListCardProps> = ({ title, data, setBackdropOpen, type = 'expense' }: ListCardProps) => {
  const navigate = useNavigate();
  const initialValue = 0;
  const total = data.reduce((accumulator, row) => accumulator + row.amount, initialValue);
  const [editable, setEditable] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAction, setSelectedAction] = useState('cancel');
  const [listData, setListData] = useState(data);

  const deleteQuery = useLazyQuery(
    async (id: number) => {
      if (type === 'passive-income') {
        await mQuery.deletePassiveIncome(id);
      } else {
        await mQuery.deleteExpense(id);
      }
    },
    {
      onSuccess: () => {
        const updatedData = listData.filter(row => row.id !== selectedId);
        setListData(updatedData);
        const itemType = type === 'passive-income' ? 'Passive income' : 'Expense';
        toast.success(`${itemType} deleted!`, config.toastOptions);
        setBackdropOpen?.(false);
      },
      onError: () => {
        toast.error('Failed to delete!', config.toastOptions);
        setBackdropOpen?.(false);
      }
    }
  );

  const longPressAttrs = useLongPress(
    () => setEditable(true),
    {
      threshold: 1000,
      // onStart: () => console.log('Press started'),
      // onFinish: () => console.log('Press Finished'),
      // onCancel: () => console.log('Press cancelled'),
    }
  );

  const handleActionDialogClose = (action: string) => {
    setEditable(false);
    setSelectedAction(action);

    if (action === 'edit') {
      const editPath = type === 'passive-income' ? `/passive-income/${selectedId}` : `/expense/${selectedId}`;
      navigate(editPath);
    } else if (action === 'delete') {
      setBackdropOpen?.(true);
      deleteQuery.mutate(selectedId);
    }
  };

  const handleItemClick = (id: number, title: string) => {
    setSelectedId(id);
    setSelectedTitle(title);
  }

  const TwoLinesText = (primaryText: string, secondaryText?: string, className?: string) => {
    return (
      <span onClick={() => setEditable(false)}>
        <Typography className={ className ? className : ''} component="span" display="block">{ primaryText }</Typography>
        { secondaryText && <Typography component="span" display="block" sx={{ color: 'text.secondary' }}>{ secondaryText}</Typography>}
      </span>
    )
  }

  return (
    <>
    {listData.length > 0 &&
      <>
        <Box className="subtitle">{ dayjs(title).format("MMM D, YYYY (ddd)") }</Box>
        <Card>
          <List>
            {
              listData.map(row => (
                <Box key={row.id}>
                  <ListItem
                    secondaryAction={
                      <ListItemText sx={{ textAlign: "right" }} primary={TwoLinesText(row.amount.toLocaleString(), `(${row.type})`)} />
                    }
                    alignItems="flex-start"
                    {...longPressAttrs}
                    onMouseUp={() => handleItemClick(row.id, row.title)}
                    sx={ editable && row.id === selectedId ? { bgcolor: grey[200] } : null}
                  >

                    {/*<Collapse orientation="horizontal" in={editable}>*/}
                    {/*  <ListItemIcon sx={{ minWidth: "36px" }}>*/}
                    {/*    <DeleteIcon color="error" />*/}
                    {/*  </ListItemIcon>*/}
                    {/*</Collapse>*/}

                    { row.category ?
                      <ListItemText
                        primary={row.title}
                        secondary={TwoLinesText(row.category.name, row.remarks, 'text-warning')}
                      />
                      : <ListItemText primary={row.title} />
                    }
                  </ListItem>
                  <Divider />
                </Box>
              ))
            }

            {/*Total by day*/}
            <ListItem
              className="bold"
              secondaryAction={
                <ListItemText primary={total.toLocaleString()} />
              }>
              <ListItemText className="my" primary="စုစုပေါင်း" />
            </ListItem>
          </List>
        </Card>

        <ActionDialog
            selectedAction={selectedAction}
            title={selectedTitle}
            open={editable}
            onClose={handleActionDialogClose}
        />
      </>
    }
    </>
  )
}

export default ListCard;

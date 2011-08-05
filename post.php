<?php

$data = json_encode($_POST['answers']);
file_put_contents("/tmp/temp", $data);
print $data;
